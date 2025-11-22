import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TestRequestsService } from './test-requests.service';
import { IsAdminGuard } from '@common/guards/is-admin.guard';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Request } from 'express';
import {
  BatchCreateTestRequestWithPatientDto,
  CreateTestResultDto,
} from './dto/create-test-request.dto';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
import { TestRequestStatus } from './entities/test-request.entity';
import { TestStatus } from './entities/requested-test.entity';

// @Controller('test-requests')
// export class TestRequestsController {
//   constructor(private readonly testRequestsService: TestRequestsService) {}

//   /**
//    * Can create test-request based on patientId or patinet Obj.
//    * If patientId, thne just insert into test_request table.
//    * If patinet Obj, then create new patient and insert into test_request table
//    */

//   @Post('admin')
//   @UseGuards(JwtAuthGuard, IsAdminGuard)
//   createTestReqByAdmin(
//     @Req() req: Request,
//     @Body() data: BatchCreateTestRequestWithPatientDto,
//   ) {
//     const adminId = req.user?.id!;
//     return this.testRequestsService.batchCreateTestRequestWithPatient(
//       data,
//       adminId,
//     );
//   }
// }

@Controller('test-requests')
@UseGuards(JwtAuthGuard)
export class TestRequestsController {
  constructor(private readonly testRequestsService: TestRequestsService) {}

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  /**
   * Admin creates test request with multiple tests
   * Can provide either existing patientId OR create new patient with profile
   *
   * Body Examples:
   *
   * Option 1 - Existing Patient:
   * {
   *   "testIds": [1, 2, 3],
   *   "patientId": 123
   * }
   *
   * Option 2 - New Patient:
   * {
   *   "testIds": [1, 2, 3],
   *   "patient": {
   *     "profile": {
   *       "fullName": "John Doe",
   *       "dob": "1990-01-01",
   *       "phone": "+1234567890",
   *       "gender": "male"
   *     }
   *   }
   * }
   */
  @Post('admin/batch')
  @UseGuards(IsAdminGuard)
  async createTestRequestByAdmin(
    @Body() batchCreateDto: BatchCreateTestRequestWithPatientDto,
    @Req() req: Request,
  ) {
    const adminId = req.user?.id!; // Extract admin ID from JWT token
    return this.testRequestsService.batchCreateTestRequestWithPatient(
      batchCreateDto,
      adminId,
    );
  }

  // ============================================
  // GENERAL ENDPOINTS (All Authenticated Users)
  // ============================================

  /**
   * Get all test requests
   */
  @Get()
  async findAllTestRequests() {
    return this.testRequestsService.findAllTestRequests();
  }

  /**
   * Get single test request by ID
   */
  @Get(':id')
  async findOneTestRequest(@Param('id') id: AppBaseEntityIdDataType) {
    return this.testRequestsService.findOneTestRequest(id);
  }

  /**
   * Get test requests by patient ID
   */
  @Get('patient/:patientId')
  async getTestRequestsByPatient(
    @Param('patientId') patientId: AppBaseEntityIdDataType,
  ) {
    return this.testRequestsService.getTestRequestsByPatient(patientId);
  }

  /**
   * Get test requests by status
   */
  @Get('status/:status')
  async getTestRequestsByStatus(@Param('status') status: TestRequestStatus) {
    return this.testRequestsService.getTestRequestsByStatus(status);
  }

  /**
   * Update test request status
   */
  @Patch(':id/status')
  async updateTestRequestStatus(
    @Param('id') id: AppBaseEntityIdDataType,
    @Body('status') status: TestRequestStatus,
  ) {
    return this.testRequestsService.updateTestRequest(id, status);
  }

  /**
   * Delete test request
   */
  @Delete(':id')
  @UseGuards(IsAdminGuard)
  async removeTestRequest(@Param('id') id: AppBaseEntityIdDataType) {
    await this.testRequestsService.removeTestRequest(id);
    return { message: 'Test request deleted successfully' };
  }

  /**
   * Get test request statistics
   */
  @Get(':id/statistics')
  async getTestRequestStatistics(@Param('id') id: AppBaseEntityIdDataType) {
    return this.testRequestsService.getTestRequestStatistics(id);
  }

  // ============================================
  // REQUESTED TEST ENDPOINTS
  // ============================================

  /**
   * Get all requested tests for a test request
   */
  @Get(':testRequestId/requested-tests')
  async getRequestedTestsByTestRequest(
    @Param('testRequestId') testRequestId: AppBaseEntityIdDataType,
  ) {
    return this.testRequestsService.getRequestedTestsByTestRequest(
      testRequestId,
    );
  }

  /**
   * Update requested test status
   */
  @Patch('requested-tests/:id/status')
  async updateRequestedTestStatus(
    @Param('id') id: AppBaseEntityIdDataType,
    @Body('status') status: TestStatus,
  ) {
    return this.testRequestsService.updateRequestedTestStatus(id, status);
  }

  /**
   * Get requested tests by status
   */
  @Get('requested-tests/status/:status')
  async getRequestedTestsByStatus(@Param('status') status: TestStatus) {
    return this.testRequestsService.getRequestedTestsByStatus(status);
  }

  // ============================================
  // TEST RESULT ENDPOINTS
  // ============================================

  /**
   * Create test result for a requested test
   * Automatically marks the requested test as COMPLETED
   */
  @Post('test-results')
  async createTestResult(@Body() createTestResultDto: CreateTestResultDto) {
    return this.testRequestsService.createTestResult(createTestResultDto);
  }

  /**
   * Get test result by ID
   */
  @Get('test-results/:id')
  async findOneTestResult(@Param('id') id: AppBaseEntityIdDataType) {
    return this.testRequestsService.findOneTestResult(id);
  }

  /**
   * Get test result by requested test ID
   */
  @Get('requested-tests/:requestedTestId/result')
  async getTestResultByRequestedTest(
    @Param('requestedTestId') requestedTestId: AppBaseEntityIdDataType,
  ) {
    return this.testRequestsService.getTestResultByRequestedTest(
      requestedTestId,
    );
  }

  /**
   * Update test result
   */
  @Patch('test-results/:id')
  async updateTestResult(
    @Param('id') id: AppBaseEntityIdDataType,
    @Body('resultValue') resultValue: string,
  ) {
    return this.testRequestsService.updateTestResult(id, resultValue);
  }

  /**
   * Delete test result
   * Reverts requested test status to IN_PROGRESS
   */
  @Delete('test-results/:id')
  @UseGuards(IsAdminGuard)
  async removeTestResult(@Param('id') id: AppBaseEntityIdDataType) {
    await this.testRequestsService.removeTestResult(id);
    return { message: 'Test result deleted successfully' };
  }
}
