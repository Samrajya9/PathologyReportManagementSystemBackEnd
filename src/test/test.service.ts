import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';
import { TestUnitService } from './modules/test-unit/test-unit.service';
import { TestCategoryMapService } from './modules/test-category-map/test-category-map.service';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';
import { MedicalDepartmentsService } from 'src/medical_departments/medical_departments.service';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: Repository<TestEntity>,
    private readonly testUnitService: TestUnitService,
    private readonly medicalDepartmentsService: MedicalDepartmentsService,
    @Inject(forwardRef(() => TestCategoryMapService))
    private readonly testCategoryMapService: TestCategoryMapService,
  ) {}

  async createTest(createTestDto: CreateTestDto) {
    const { medicalDepartmentId, testUnitId, categoryIds, ...data } =
      createTestDto;
    const [medicalDepartment, testUnit] = await Promise.all([
      this.medicalDepartmentsService.findOne(medicalDepartmentId),
      this.testUnitService.findOne(testUnitId),
    ]);
    const newTest = this.testRepo.create({
      medicalDepartment,
      testUnit,
      ...data,
    });

    const test = await this.testRepo.save(newTest);
    const testCategoryMap = createTestDto.categoryIds.map((categoryId) => {
      return this.testCategoryMapService.create({
        testId: test.id,
        categoryId,
      });
    });
    await Promise.all(testCategoryMap);
    return await this.findOne(test.id);
  }

  async findAllTest(page?: number, limit?: number) {
    const options: FindManyOptions = {
      relations: {
        testUnit: true,
        medicalDepartment: true,
        categoryMappings: {
          category: true,
        },
      },
    };
    if (page !== undefined && limit !== undefined) {
      // Add pagination when both parameters are provided
      options['skip'] = (page - 1) * limit;
      options['take'] = limit;
      const [data, total] = await this.testRepo.findAndCount(options);
      return {
        data,
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
        testUnit: true,
        medicalDepartment: true,
        categoryMappings: {
          category: true,
        },
      },
    });
    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }
    return test;
  }

  async updateTest(id: AppBaseEntityIdDataType, updateTestDto: UpdateTestDto) {
    const {
      name,
      price,
      medicalDepartmentId,
      testUnitId,
      normalRangeMin,
      normalRangeMax,
      categoryIds,
    } = updateTestDto;

    const test = await this.findOne(id);
    this.testRepo.merge(test, {
      name,
      price,
      normalRangeMin,
      normalRangeMax,
      medicalDepartment: medicalDepartmentId
        ? { id: medicalDepartmentId }
        : undefined,
      testUnit: testUnitId ? { id: testUnitId } : undefined,
    });
    const updatedTest = await this.testRepo.save(test);

    if (categoryIds && categoryIds.length > 0) {
      const currentMapping = await this.testCategoryMapService.findAllByTestId(
        updatedTest.id,
      );
      const currentCategoryIds = currentMapping.map((m) => m.category.id);
      //[1,2,3]
      const newCategoryIds = categoryIds;
      //[2,3,4]

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

    return await this.findOne(updatedTest.id);
  }

  async removeTest(id: number) {
    return this.testRepo.delete({ id });
  }

  private async handleCategoryUpdates(
    testId: AppBaseEntityIdDataType,
    newCategoryIds: AppBaseEntityIdDataType[],
  ) {
    const currentMapping =
      await this.testCategoryMapService.findAllByTestId(testId);
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
    return await this.testCategoryMapService.findAllByTestId(testId);
  }
}
