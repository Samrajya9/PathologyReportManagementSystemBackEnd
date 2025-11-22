import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BatchCreateTestRequestDto,
  BatchCreateTestRequestWithPatientDto,
  CreateRequestedTestDto,
  CreateTestRequestDto,
  CreateTestResultDto,
} from './dto/create-test-request.dto';

import { InjectRepository } from '@nestjs/typeorm';
import {
  RequestedTestEntity,
  TestStatus,
} from './entities/requested-test.entity';
import { DataSource, Repository } from 'typeorm';
import {
  TestRequestEntity,
  TestRequestStatus,
} from './entities/test-request.entity';
import { TestResultEntity } from './entities/test-result.entity';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
import { PatientService } from '@modules/patient/patient.service';
import { PatientCreatedBy } from '@modules/patient/entities/patient.entity';

@Injectable()
export class TestRequestsService {
  constructor(
    @InjectRepository(TestRequestEntity)
    private readonly testRequestRepo: Repository<TestRequestEntity>,

    @InjectRepository(RequestedTestEntity)
    private readonly requestedTestRepo: Repository<RequestedTestEntity>,

    @InjectRepository(TestResultEntity)
    private readonly testResultRepo: Repository<TestResultEntity>,
    private readonly patientService: PatientService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Find one test request by ID
   */
  async findOneTestRequest(
    id: AppBaseEntityIdDataType,
  ): Promise<TestRequestEntity> {
    const testRequest = await this.testRequestRepo.findOne({
      where: { id },
      relations: [
        'patient',
        'patient.profile',
        'requestedTests',
        'requestedTests.test',
        'requestedTests.result',
      ],
    });

    if (!testRequest) {
      throw new NotFoundException(`Test request with ID ${id} not found`);
    }

    return testRequest;
  }

  /**
   * Find all test requests
   */
  async findAllTestRequests(): Promise<TestRequestEntity[]> {
    return this.testRequestRepo.find({
      relations: [
        'patient',
        'patient.profile',
        'requestedTests',
        'requestedTests.test',
        'requestedTests.result',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Create a basic test request (no tests attached yet)
   */
  async createTestRequest(
    createTestRequestDto: CreateTestRequestDto,
  ): Promise<TestRequestEntity> {
    // Verify patient exists
    await this.patientService.findOne(createTestRequestDto.patientId);

    const testRequest = this.testRequestRepo.create(createTestRequestDto);
    const saved = await this.testRequestRepo.save(testRequest);

    return this.findOneTestRequest(saved.id);
  }

  /**
   * Update test request (mainly status)
   */
  async updateTestRequest(
    id: AppBaseEntityIdDataType,
    status: TestRequestStatus,
  ): Promise<TestRequestEntity> {
    const testRequest = await this.findOneTestRequest(id);
    testRequest.status = status;
    await this.testRequestRepo.save(testRequest);
    return this.findOneTestRequest(id);
  }

  /**
   * Remove test request (cascades to requested tests and results)
   */
  async removeTestRequest(id: AppBaseEntityIdDataType): Promise<void> {
    const testRequest = await this.findOneTestRequest(id);
    await this.testRequestRepo.remove(testRequest);
  }

  // ============================================
  // BATCH TEST REQUEST OPERATIONS
  // ============================================
  /**
   * Create test request with multiple tests for existing patient
   */
  async batchCreateTestRequest(batchCreateDto: BatchCreateTestRequestDto) {
    const { testIds, patientId, status } = batchCreateDto;

    // Verify patient exists
    await this.patientService.findOne(patientId);

    return this.dataSource.transaction(async (manager) => {
      // Create test request
      const testRequest = manager.create(TestRequestEntity, {
        patientId,
        status: status || TestRequestStatus.PENDING,
      });
      const savedRequest = await manager.save(testRequest);

      // Create requested tests
      const requestedTests = testIds.map((testId) =>
        manager.create(RequestedTestEntity, {
          testRequestId: savedRequest.id,
          testId,
          status: TestStatus.PENDING,
        }),
      );
      await manager.save(RequestedTestEntity, requestedTests);

      // Return with relations
      return manager.findOne(TestRequestEntity, {
        where: { id: savedRequest.id },
        relations: [
          'patient',
          'patient.profile',
          'requestedTests',
          'requestedTests.test',
        ],
      });
    });
  }

  /**
   * Admin creates test request with either existing patient or new patient
   */
  async batchCreateTestRequestWithPatient(
    batchCreateDto: BatchCreateTestRequestWithPatientDto,
    adminId: AppBaseEntityIdDataType,
  ) {
    const { testIds, patientId, patient, status } = batchCreateDto;

    let resolvedPatientId: AppBaseEntityIdDataType;

    if (patientId) {
      // Use existing patient
      resolvedPatientId = patientId;
      await this.patientService.findOne(patientId);
    } else if (patient) {
      // Create new patient with profile
      const createdPatient = await this.patientService.create({
        ...patient,
        createdBy: PatientCreatedBy.ADMIN,
        createdById: adminId,
      });
      resolvedPatientId = createdPatient.id;
    } else {
      throw new BadRequestException(
        'Either patientId or patient must be provided',
      );
    }

    return this.batchCreateTestRequest({
      testIds,
      patientId: resolvedPatientId,
      status,
    });
  }

  // ============================================
  // REQUESTED TEST OPERATIONS
  // ============================================

  /**
   * Create individual requested test
   */
  async createRequestedTest(createRequestedTestDto: CreateRequestedTestDto) {
    // Verify test request exists
    await this.findOneTestRequest(createRequestedTestDto.testRequestId);

    const requestedTest = this.requestedTestRepo.create(createRequestedTestDto);
    const saved = await this.requestedTestRepo.save(requestedTest);

    return this.requestedTestRepo.findOne({
      where: { id: saved.id },
      relations: ['testRequest', 'test', 'result'],
    });
  }

  /**
   * Find one requested test by ID
   */
  async findOneRequestedTest(
    id: AppBaseEntityIdDataType,
  ): Promise<RequestedTestEntity> {
    const requestedTest = await this.requestedTestRepo.findOne({
      where: { id },
      relations: ['testRequest', 'test', 'result'],
    });

    if (!requestedTest) {
      throw new NotFoundException(`Requested test with ID ${id} not found`);
    }

    return requestedTest;
  }

  /**
   * Update requested test status
   */
  async updateRequestedTestStatus(
    id: AppBaseEntityIdDataType,
    status: TestStatus,
  ): Promise<RequestedTestEntity> {
    const requestedTest = await this.findOneRequestedTest(id);
    requestedTest.status = status;
    await this.requestedTestRepo.save(requestedTest);

    // Auto-update parent test request status
    await this.autoUpdateTestRequestStatus(requestedTest.testRequestId);

    return this.findOneRequestedTest(id);
  }

  /**
   * Remove requested test
   */
  async removeRequestedTest(id: AppBaseEntityIdDataType): Promise<void> {
    const requestedTest = await this.findOneRequestedTest(id);
    const testRequestId = requestedTest.testRequestId;

    await this.requestedTestRepo.remove(requestedTest);

    // Auto-update parent test request status
    await this.autoUpdateTestRequestStatus(testRequestId);
  }
  // ============================================
  // TEST RESULT OPERATIONS
  // ============================================

  /**
   * Create test result for a requested test
   */
  async createTestResult(createTestResultDto: CreateTestResultDto) {
    const { requestedTestId, resultValue } = createTestResultDto;

    // Check if requested test exists
    const requestedTest = await this.requestedTestRepo.findOne({
      where: { id: requestedTestId },
      relations: ['result'],
    });

    if (!requestedTest) {
      throw new NotFoundException(
        `Requested test with ID ${requestedTestId} not found`,
      );
    }

    if (requestedTest.result) {
      throw new ConflictException(
        `Test result already exists for requested test ${requestedTestId}`,
      );
    }

    // Create and save result
    const testResult = this.testResultRepo.create({
      requestedTestId,
      resultValue,
    });
    const savedResult = await this.testResultRepo.save(testResult);

    // Update requested test status
    requestedTest.status = TestStatus.COMPLETED;
    await this.requestedTestRepo.save(requestedTest);

    // Auto-update parent
    await this.autoUpdateTestRequestStatus(requestedTest.testRequestId);

    return this.testResultRepo.findOne({
      where: { id: savedResult.id },
      relations: ['requestedTest', 'requestedTest.test'],
    });
  }

  /**
   * Find one test result by ID
   */
  async findOneTestResult(
    id: AppBaseEntityIdDataType,
  ): Promise<TestResultEntity> {
    const testResult = await this.testResultRepo.findOne({
      where: { id },
      relations: ['requestedTest', 'requestedTest.test'],
    });

    if (!testResult) {
      throw new NotFoundException(`Test result with ID ${id} not found`);
    }

    return testResult;
  }

  /**
   * Update test result
   */
  async updateTestResult(
    id: AppBaseEntityIdDataType,
    resultValue: string,
  ): Promise<TestResultEntity> {
    const testResult = await this.findOneTestResult(id);
    testResult.resultValue = resultValue;
    await this.testResultRepo.save(testResult);
    return this.findOneTestResult(id);
  }

  /**
   * Get test result by requested test ID
   */
  async getTestResultByRequestedTest(
    requestedTestId: AppBaseEntityIdDataType,
  ): Promise<TestResultEntity> {
    const testResult = await this.testResultRepo.findOne({
      where: { requestedTestId },
      relations: ['requestedTest', 'requestedTest.test'],
    });

    if (!testResult) {
      throw new NotFoundException(
        `Test result for requested test ${requestedTestId} not found`,
      );
    }

    return testResult;
  }

  /**
   * Remove test result
   */
  async removeTestResult(id: AppBaseEntityIdDataType): Promise<void> {
    const testResult = await this.findOneTestResult(id);
    const requestedTestId = testResult.requestedTestId;

    await this.testResultRepo.remove(testResult);

    // Update requested test status back to IN_PROGRESS
    const requestedTest = await this.requestedTestRepo.findOne({
      where: { id: requestedTestId },
    });

    if (requestedTest) {
      requestedTest.status = TestStatus.IN_PROGRESS;
      await this.requestedTestRepo.save(requestedTest);

      // Auto-update parent test request status
      await this.autoUpdateTestRequestStatus(requestedTest.testRequestId);
    }
  }

  // ============================================
  // QUERY METHODS
  // ============================================

  /**
   * Get all test requests for a specific patient
   */
  async getTestRequestsByPatient(
    patientId: AppBaseEntityIdDataType,
  ): Promise<TestRequestEntity[]> {
    return this.testRequestRepo.find({
      where: { patientId },
      relations: [
        'patient',
        'patient.profile',
        'requestedTests',
        'requestedTests.test',
        'requestedTests.result',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get test requests by status
   */
  async getTestRequestsByStatus(
    status: TestRequestStatus,
  ): Promise<TestRequestEntity[]> {
    return this.testRequestRepo.find({
      where: { status },
      relations: [
        'patient',
        'patient.profile',
        'requestedTests',
        'requestedTests.test',
        'requestedTests.result',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get requested tests by status
   */
  async getRequestedTestsByStatus(
    status: TestStatus,
  ): Promise<RequestedTestEntity[]> {
    return this.requestedTestRepo.find({
      where: { status },
      relations: ['testRequest', 'testRequest.patient', 'test', 'result'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all requested tests for a test request
   */
  async getRequestedTestsByTestRequest(
    testRequestId: AppBaseEntityIdDataType,
  ): Promise<RequestedTestEntity[]> {
    return this.requestedTestRepo.find({
      where: { testRequestId },
      relations: ['test', 'result'],
      order: { createdAt: 'ASC' },
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Automatically update test request status based on requested tests
   */
  private async autoUpdateTestRequestStatus(
    testRequestId: AppBaseEntityIdDataType,
  ): Promise<void> {
    const testRequest = await this.testRequestRepo.findOne({
      where: { id: testRequestId },
      relations: ['requestedTests'],
    });

    if (!testRequest || !testRequest.requestedTests.length) {
      return;
    }

    const statuses = testRequest.requestedTests.map((rt) => rt.status);

    // All completed -> COMPLETED
    if (statuses.every((s) => s === TestStatus.COMPLETED)) {
      testRequest.status = TestRequestStatus.COMPLETED;
    }
    // All cancelled -> CANCELLED
    else if (statuses.every((s) => s === TestStatus.CANCELLED)) {
      testRequest.status = TestRequestStatus.CANCELLED;
    }
    // Any in progress -> IN_PROGRESS
    else if (statuses.some((s) => s === TestStatus.IN_PROGRESS)) {
      testRequest.status = TestRequestStatus.IN_PROGRESS;
    }
    // Otherwise keep PENDING
    else {
      testRequest.status = TestRequestStatus.PENDING;
    }

    await this.testRequestRepo.save(testRequest);
  }

  /**
   * Get statistics for a test request
   */
  async getTestRequestStatistics(
    testRequestId: AppBaseEntityIdDataType,
  ): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    withResults: number;
  }> {
    const testRequest = await this.findOneTestRequest(testRequestId);
    const requestedTests = testRequest.requestedTests;

    return {
      total: requestedTests.length,
      pending: requestedTests.filter((rt) => rt.status === TestStatus.PENDING)
        .length,
      inProgress: requestedTests.filter(
        (rt) => rt.status === TestStatus.IN_PROGRESS,
      ).length,
      completed: requestedTests.filter(
        (rt) => rt.status === TestStatus.COMPLETED,
      ).length,
      cancelled: requestedTests.filter(
        (rt) => rt.status === TestStatus.CANCELLED,
      ).length,
      withResults: requestedTests.filter((rt) => rt.result !== null).length,
    };
  }
}

// async createByAdmin(
//   dto: CreateTestRequestAndPatientProfileByAdminDto,
//   adminId: AppBaseEntityIdDataType,
// ) {
//   let requestData: CreateTestRequestDto | null = null;
//   const { patientId, patient, ...rest } = dto;

//   // Case 1: using existing patient
//   if (patientId && !patient) {
//     requestData = {
//       patientId,
//       ...rest,
//     };
//   }

//   // Case 2: creating a new patient + profile
//   if (!patientId && patient) {
//     const result = await this.patientService.create({
//       ...patient,
//       createdBy: PatientCreatedBy.ADMIN,
//       createdById: adminId,
//     });

//     const newPatientId = result.id;

//     requestData = {
//       patientId: newPatientId,
//       ...rest,
//     };
//   }

//   if (!requestData) {
//     throw new BadRequestException(
//       'Either patientId or patientProfile must be provided',
//     );
//   }

//   return this.create(requestData);
// }

// async createByUser(
//   createByUserDto: CreateTestRequestByUserDto,
//   patientId: AppBaseEntityIdDataType,
// ) {
//   return await this.create({ patientId, ...createByUserDto });
// }

// async create(createTestRequestDto: CreateTestRequestDto) {
//   const { testIds, ...rest } = createTestRequestDto;
//   // 1️⃣ Create the test request
//   const newTestRequest = this.testRequestRepo.create(rest);
//   const savedTestRequest = await this.testRequestRepo.save(newTestRequest);

//   // 2️⃣ Create requested tests
//   const requestedTests = testIds.map((testId) =>
//     this.requestedTestRepo.create({
//       test: { id: testId },
//       testRequest: savedTestRequest, // relation to TestRequestEntity
//     }),
//   );
//   // 3️⃣ Save all requested tests
//   await this.requestedTestRepo.save(requestedTests);

//   // 4️⃣ Return the full saved request (optionally with nested tests)
//   const createdRequest = await this.testRequestRepo.findOne({
//     where: { id: savedTestRequest.id },
//   });

//   return createdRequest;
// }

// async findAll() {
//   const testRequest = await this.testRequestRepo.find();
//   return { testRequest };
// }

// async findOne(id: AppBaseEntityIdDataType) {
//   const testRequest = await this.testRequestRepo.findOne({
//     where: { id },
//     relations: [
//       'requestedTests',
//       'requestedTests.test',
//       'requestedTests.result', // ← Access result through requestedTests
//       'patient',
//       'patient.profile', // Optional: include patient data
//     ],
//   });
//   return { testRequest };
// }

// async updateByAdmin(
//   id: AppBaseEntityIdDataType,
//   updateTestRequestDto: UpdateTestRequestByAdminDto,
//   adminId: AppBaseEntityIdDataType,
// ) {
//   const { testIds, patient, ...rest } = updateTestRequestDto;
//   let requestData: UpdateTestRequestDto = {
//     ...rest,
//     testIds,
//   };

//   if (patient) {
//     const result = await this.patientService.create({
//       ...patient,
//       createdBy: PatientCreatedBy.ADMIN,
//       createdById: adminId,
//     });

//     const newPatientId = result.id;
//     requestData = {
//       ...requestData,
//       patientId: newPatientId,
//     };
//   }
//   return this.update(id, requestData);
// }

// async update(
//   id: AppBaseEntityIdDataType,
//   updateTestRequestDto: UpdateTestRequestDto,
// ) {
//   const { testIds, ...testReqDto } = updateTestRequestDto;
//   const testRequest = await this.testRequestRepo.findOne({
//     where: { id },
//     relations: ['requestedTests', 'requestedTests.test'],
//   });

//   if (!testRequest) throw new NotFoundException('Test request not found');
//   console.log(testRequest.requestedTests);

//   // Merge non-test fields
//   Object.assign(testRequest, testReqDto);
//   const savedTestRequest = await this.testRequestRepo.save(testRequest);

//   // if testIds then, fetch all the pervious testIds for particular testRequested and compare what need to be removed and what need to be add
//   if (testIds && testIds.length > 0) {
//     const existingTestIds = testRequest.requestedTests.map(
//       (rt) => rt.test.id,
//     );

//     const toRemove = testRequest.requestedTests.filter(
//       (rt) => !testIds.includes(rt.test.id),
//     );
//     const toAddIds = testIds.filter((tid) => !existingTestIds.includes(tid));

//     if (toRemove.length > 0) {
//       await this.requestedTestRepo.remove(toRemove);
//     }

//     if (toAddIds.length > 0) {
//       // create() is synchronous - no await needed
//       const newRequestedTests = toAddIds.map((tid) =>
//         this.requestedTestRepo.create({
//           test: { id: tid },
//           testRequest: savedTestRequest,
//         }),
//       );
//       // NOW save them to the database
//       await this.requestedTestRepo.save(newRequestedTests);
//     }
//   }
//   return this.testRequestRepo.findOne({
//     where: { id },
//     relations: ['requestedTests', 'requestedTests.test'],
//   });
// }

// async updateRequestedTest(
//   requestedTestId: AppBaseEntityIdDataType,
//   updateRequestedTestDto: UpdateRequestedTestDto,
// ) {
//   const requestedTest = await this.requestedTestRepo.findOne({
//     where: { id: requestedTestId },
//     relations: ['test', 'testRequest'],
//   });

//   if (!requestedTest) {
//     throw new NotFoundException('Requested test not found');
//   }

//   // Merge updates
//   Object.assign(requestedTest, updateRequestedTestDto);

//   // Save and return
//   return this.requestedTestRepo.save(requestedTest);
// }

// // Update test result
// async updateTestResult(
//   testResultId: AppBaseEntityIdDataType,
//   updateTestResultDto: UpdateTestResultDto,
// ) {
//   const testResult = await this.testResultRepo.findOne({
//     where: { id: testResultId },
//     relations: ['testOrderTest'],
//   });

//   if (!testResult) {
//     throw new NotFoundException('Test result not found');
//   }

//   // Merge updates
//   Object.assign(testResult, updateTestResultDto);

//   // Save and return
//   return this.testResultRepo.save(testResult);
// }

// async upsertTestResult(
//   requestedTestId: AppBaseEntityIdDataType,
//   updateTestResultDto: UpdateTestResultDto,
// ) {
//   // Check if requested test exists
//   const requestedTest = await this.requestedTestRepo.findOne({
//     where: { id: requestedTestId },
//     relations: ['result'],
//   });

//   if (!requestedTest) {
//     throw new NotFoundException('Requested test not found');
//   }

//   // If result already exists, update it
//   if (requestedTest.result) {
//     Object.assign(requestedTest.result, updateTestResultDto);
//     return this.testResultRepo.save(requestedTest.result);
//   }

//   // Otherwise, create a new result
//   const newResult = this.testResultRepo.create({
//     ...updateTestResultDto,
//     requestedTest: requestedTest,
//   });

//   return this.testResultRepo.save(newResult);
// }
