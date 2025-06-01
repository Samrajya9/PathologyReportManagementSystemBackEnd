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
import { TestTypeService } from './modules/test-type/test-type.service';
import { TestUnitService } from './modules/test-unit/test-unit.service';
import { TestCategoryMapService } from './modules/test-category-map/test-category-map.service';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: Repository<TestEntity>,
    private readonly testTypeService: TestTypeService,
    private readonly testUnitService: TestUnitService,
    @Inject(forwardRef(() => TestCategoryMapService))
    private readonly testCategoryMapService: TestCategoryMapService,
  ) {}

  async createTest(createTestDto: CreateTestDto) {
    const { testTypeId, testUnitId, categoryIds, ...data } = createTestDto;
    const [testType, testUnit] = await Promise.all([
      this.testTypeService.findOne(testTypeId),
      this.testUnitService.findOne(testUnitId),
    ]);
    const newTest = this.testRepo.create({ testType, testUnit, ...data });

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
        testType: true,
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
      // relations: {
      //   testUnit: true,
      //   testType: true,
      //   categoryMappings: {
      //     category: true,
      //   },
      // },
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
      testTypeId,
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
      testType: testTypeId ? { id: testTypeId } : undefined,
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
