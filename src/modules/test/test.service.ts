import {
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
import { TestCategoryMapService } from './modules/test-category-map/test-category-map.service';
import { AppBaseEntityIdDataType } from 'src/common/entity/BaseEntity';
import { MedicalDepartmentsService } from '@modules/medical_departments/medical_departments.service';
import { ReferenceRangesService } from './modules/reference_ranges/reference_ranges.service';
import { SpecimensService } from '@modules/specimens/specimens.service';
import { ResultValueTypesService } from './modules/result_value_types/result_value_types.service';
import { ContainerService } from '@modules/container/container.service';
import { TestSpecimenContainerService } from './modules/test_specimen_container/test_specimen_container.service';
import { SearchTestDto } from './dto/search-test.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: Repository<TestEntity>,
    private readonly testUnitService: TestUnitService,
    private readonly medicalDepartmentsService: MedicalDepartmentsService,
    @Inject(forwardRef(() => TestCategoryMapService))
    private readonly testCategoryMapService: TestCategoryMapService,
    @Inject(forwardRef(() => ReferenceRangesService))
    private readonly refRangeService: ReferenceRangesService,
    private readonly specimensService: SpecimensService,
    private readonly resultValueTypesService: ResultValueTypesService,
    private readonly containerService: ContainerService,
    private readonly tSCService: TestSpecimenContainerService,
  ) {}

  async createTest(createTestDto: CreateTestDto) {
    const {
      medicalDepartmentId,
      testUnitId,
      categoryIds,
      referenceRanges,
      resultValueTypeId,
      specimenRequirements,
      ...data
    } = createTestDto;

    const [medicalDepartment, testUnit, resultValueType] = await Promise.all([
      this.medicalDepartmentsService.findOne(medicalDepartmentId),
      this.testUnitService.findOne(testUnitId),
      this.resultValueTypesService.findOne(resultValueTypeId),
    ]);

    const newTest = this.testRepo.create({
      medicalDepartment,
      testUnit,
      resultValueType,
      ...data,
    });

    const test = await this.testRepo.save(newTest);

    await Promise.all([
      // ...categoryIds.map((categoryId) => {
      //   return this.testCategoryMapService.create({
      //     testId: test.id,
      //     categoryId,
      //   });
      // }),
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
    ]);

    return await this.findOne(test.id);
  }

  async findAllTest(page?: number, limit?: number) {
    const options: FindManyOptions = {
      relations: {
        referenceRanges: true,
        categoryMappings: {
          category: true,
        },
      },
      order: {
        id: 'DESC',
      },
    };
    if (page !== undefined && limit !== undefined) {
      // Add pagination when both parameters are provided
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
        data: processedData,
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
    const testDetails =
      await this.testCategoryMapService.findAllCategoryForTestByTestId(id);
    const test = await this.testRepo.findOne({
      where: { id },
      relations: {
        referenceRanges: true,
        resultValueOptions: true,
        resultValueType: true,
      },
    });

    if (!test) throw new NotFoundException(`Test with ID ${id} not found`);

    const specimenRequirements = await this.tSCService.findByTestId(test.id);

    const categories =
      await this.testCategoryMapService.findAllCategoryForTestByTestId(test.id);
    // const reference_range = await this.refRangeService.findByTestId(test.id);
    return { ...test, categories, specimenRequirements: specimenRequirements };
  }

  async updateTest(id: AppBaseEntityIdDataType, updateTestDto: UpdateTestDto) {
    const {
      name,
      price,
      medicalDepartmentId,
      testUnitId,
      categoryIds,
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

    if (categoryIds && categoryIds.length > 0) {
      const currentMapping =
        await this.testCategoryMapService.findAllCategoryForTestByTestId(
          updatedTest.id,
        );
      const currentCategoryIds = currentMapping.map((m) => m.category.id);
      const newCategoryIds = categoryIds;
      const categoriesChanged =
        currentCategoryIds.length !== newCategoryIds.length ||
        !currentCategoryIds.every((id) => newCategoryIds.includes(id)) ||
        !newCategoryIds.every((id) => currentCategoryIds.includes(id));
      if (categoriesChanged) {
        const toRemove = currentMapping.filter(
          (m) => !newCategoryIds.includes(m.category.id),
        );
        const toAdd = newCategoryIds.filter(
          (id) => !currentCategoryIds.includes(id),
        );

        await Promise.all([
          ...toRemove.map((mapping) =>
            this.testCategoryMapService.remove(mapping.id),
          ),
          ...toAdd.map((categoryId) =>
            this.testCategoryMapService.create({
              testId: updatedTest.id,
              categoryId,
            }),
          ),
        ]);
      }
    }
    if (referenceRanges) {
      // Reference Range Dto's Id (it contain id of ref Range from dto )
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
  private async handleCategoryUpdates(
    testId: AppBaseEntityIdDataType,
    newCategoryIds: AppBaseEntityIdDataType[],
  ) {
    const currentMapping =
      await this.testCategoryMapService.findAllCategoryForTestByTestId(testId);
    const currentCategoryIds = currentMapping.map((m) => m.category.id);
    const categoriesChanged =
      currentCategoryIds.length !== newCategoryIds.length ||
      !currentCategoryIds.every((id) => newCategoryIds.includes(id)) ||
      !newCategoryIds.every((id) => currentCategoryIds.includes(id));

    if (categoriesChanged) {
      const toRemove = currentMapping.filter(
        (m) => !newCategoryIds.includes(m.category.id),
      );
      const toAdd = newCategoryIds.filter(
        (id) => !currentCategoryIds.includes(id),
      );

      await Promise.all([
        ...toRemove.map((mapping) =>
          this.testCategoryMapService.remove(mapping.id),
        ),
        ...toAdd.map((categoryId) =>
          this.testCategoryMapService.create({
            testId,
            categoryId,
          }),
        ),
      ]);
    }
    return await this.testCategoryMapService.findAllCategoryForTestByTestId(
      testId,
    );
  }
}
