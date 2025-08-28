import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';
import { TestUnitService } from './modules/test-unit/test-unit.service';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
import { MedicalDepartmentsService } from '@modules/medical_departments/medical_departments.service';
import { ReferenceRangesService } from './modules/reference_ranges/reference_ranges.service';
import { SpecimensService } from '@modules/specimens/specimens.service';
import { ContainerService } from '@modules/container/container.service';
import { TestSpecimenContainerService } from './modules/test_specimen_container/test_specimen_container.service';
import { SearchTestDto } from './dto/search-test.dto';
import { ResultValueTypeEnum } from '@common/enums/result-value-type.enum';
import { ResultValueOptionsService } from './modules/result_value_options/result_value_options.service';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: Repository<TestEntity>,
    private readonly testUnitService: TestUnitService,
    private readonly medicalDepartmentsService: MedicalDepartmentsService,
    @Inject(forwardRef(() => ReferenceRangesService))
    private readonly refRangeService: ReferenceRangesService,
    private readonly specimensService: SpecimensService,
    private readonly containerService: ContainerService,
    private readonly tSCService: TestSpecimenContainerService,
    private readonly rVOService: ResultValueOptionsService,
  ) {}

  async createTest(createTestDto: CreateTestDto) {
    const {
      medicalDepartmentId,
      testUnitId,
      referenceRanges,
      resultValueType,
      specimenRequirements,
      resultValueOptions,
      ...data
    } = createTestDto;

    const [medicalDepartment, testUnit] = await Promise.all([
      this.medicalDepartmentsService.findOne(medicalDepartmentId),
      this.testUnitService.findOne(testUnitId),
    ]);

    const newTest = this.testRepo.create({
      medicalDepartment,
      testUnit,
      resultValueType: ResultValueTypeEnum[resultValueType],
      ...data,
    });

    const test = await this.testRepo.save(newTest);

    await Promise.all([
      ...referenceRanges.map((refRange) => {
        return this.refRangeService.create(refRange, test);
      }),
      ...specimenRequirements.map(async (details) => {
        const { specimenId, containerId } = details;
        const [specimen, cotanier] = await Promise.all([
          this.specimensService.findOne(specimenId),
          this.containerService.findOne(containerId),
        ]);
        return this.tSCService.createFormObj(test, specimen, cotanier);
      }),
      resultValueOptions
        ? resultValueOptions.map((option) => {
            return this.rVOService.create(option, test);
          })
        : null,
    ]);

    return await this.findOne(test.id);
  }

  async findAllTest(page?: number, limit?: number) {
    const options: FindManyOptions = {
      relations: {
        referenceRanges: true,
      },
      order: {
        id: 'DESC',
      },
    };
    if (page !== undefined && limit !== undefined) {
      options['skip'] = (page - 1) * limit;
      options['take'] = limit;
      const [data, total] = await this.testRepo.findAndCount(options);
      const processedData = await Promise.all(
        data.map(async (test) => {
          const specimenRequirements = await this.tSCService.findByTestId(
            test.id,
          );
          return { ...test, specimenRequirements: specimenRequirements };
        }),
      );

      return {
        tests: processedData,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
    return this.testRepo.find(options);
  }

  async findOne(id: AppBaseEntityIdDataType) {
    const test = await this.testRepo.findOne({
      where: { id },
      relations: {
        referenceRanges: true,
        resultValueOptions: true,
      },
    });

    if (!test) throw new NotFoundException(`Test with ID ${id} not found`);

    const specimenRequirements = await this.tSCService.findByTestId(test.id);

    return { ...test, specimenRequirements };
  }

  async updateTest(id: AppBaseEntityIdDataType, updateTestDto: UpdateTestDto) {
    const {
      name,
      price,
      medicalDepartmentId,
      testUnitId,
      // categoryIds,
      referenceRanges,
    } = updateTestDto;

    const test = await this.findOne(id);
    this.testRepo.merge(test, {
      name,
      price,
      medicalDepartment: medicalDepartmentId
        ? { id: medicalDepartmentId }
        : undefined,
      testUnit: testUnitId ? { id: testUnitId } : undefined,
    });
    const updatedTest = await this.testRepo.save(test);

    // if (categoryIds && categoryIds.length > 0) {
    //   const currentMapping =
    //     await this.testCategoryMapService.findAllCategoryForTestByTestId(
    //       updatedTest.id,
    //     );
    //   const currentCategoryIds = currentMapping.map((m) => m.category.id);
    //   const newCategoryIds = categoryIds;
    //   const categoriesChanged =
    //     currentCategoryIds.length !== newCategoryIds.length ||
    //     !currentCategoryIds.every((id) => newCategoryIds.includes(id)) ||
    //     !newCategoryIds.every((id) => currentCategoryIds.includes(id));
    //   if (categoriesChanged) {
    //     const toRemove = currentMapping.filter(
    //       (m) => !newCategoryIds.includes(m.category.id),
    //     );
    //     const toAdd = newCategoryIds.filter(
    //       (id) => !currentCategoryIds.includes(id),
    //     );

    //     await Promise.all([
    //       ...toRemove.map((mapping) =>
    //         this.testCategoryMapService.remove(mapping.id),
    //       ),
    //       ...toAdd.map((categoryId) =>
    //         this.testCategoryMapService.create({
    //           testId: updatedTest.id,
    //           categoryId,
    //         }),
    //       ),
    //     ]);
    //   }
    // }

    if (referenceRanges) {
      const dtoRangeIds = referenceRanges
        .map((r) => r.id)
        .filter((id): id is number => id !== undefined);

      const existingRanges = await this.refRangeService.findByTestId(
        updatedTest.id,
      );

      const existingRangeMap = new Map(existingRanges.map((r) => [r.id, r]));

      const toDelete = existingRanges.filter(
        (r) => !dtoRangeIds.includes(r.id),
      );
      await Promise.all([
        ...referenceRanges.map(async (dto) => {
          if (dto.id && existingRangeMap.has(dto.id)) {
            await this.refRangeService.update(dto.id, updatedTest, dto);
          } else {
            await this.refRangeService.create(dto, updatedTest);
          }
        }),
        ...toDelete.map((r) => this.refRangeService.remove(r.id)),
      ]);
    }
    return await this.findOne(updatedTest.id);
  }

  async removeTest(id: number) {
    return this.testRepo.delete({ id });
  }

  async searchTests(searchDto: SearchTestDto) {
    const { name } = searchDto;
    return this.testRepo.find({
      where: name ? { name: ILike(`%${name}&`) } : {},
    });
  }
}
