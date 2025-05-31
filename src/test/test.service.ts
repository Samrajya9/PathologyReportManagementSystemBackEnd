import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';
import { TestUnitEntity } from './entities/test.unit.entity';
import { TestTypeEntity } from './entities/test.type.entity';
import { TestCategoryEntity } from './entities/test.category.entity';
import { TestCategoryMapEntity } from './entities/test.category.map.entity';
import { CreateTestUnitDto } from './dto/create-test-unit.dto';
import { CreateTestTypeDto } from './dto/create-test-type.dto';
import { CreateTestCategoryDto } from './dto/create-test-category.dto';
import { CreateTestCategoryMapDto } from './dto/create-test-category-map.dto';
import { GlobalEntityIdDataType } from 'src/global/entity/BaseEntity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: Repository<TestEntity>,
    @InjectRepository(TestUnitEntity)
    private readonly testUnitRepo: Repository<TestUnitEntity>,
    @InjectRepository(TestTypeEntity)
    private readonly testTypeRepo: Repository<TestTypeEntity>,
    @InjectRepository(TestCategoryEntity)
    private readonly testCategoryRepo: Repository<TestCategoryEntity>,
    @InjectRepository(TestCategoryMapEntity)
    private readonly testCategoryMapRepo: Repository<TestCategoryMapEntity>,
  ) {}

  // Test Services
  async createTest(createTestDto: CreateTestDto) {
    const [testType, testUnit] = await Promise.all([
      this.findOneTestType(Number(createTestDto.testTypeId)),
      this.findOneTestUnit(Number(createTestDto.testUnitId)),
    ]);
    const newTest = this.testRepo.create(createTestDto);
    newTest.testType = testType;
    newTest.testUnit = testUnit;

    const test = await this.testRepo.save(newTest);
    const testCategoryMap = createTestDto.categoryIds.map((categoryId) => {
      return this.createTestCategoryMap({
        testId: String(test.id),
        categoryId,
      });
    });
    await Promise.all(testCategoryMap);
    return await this.findOneTest(test.id);
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

  async findOneTest(id: number) {
    const test = await this.testRepo.findOne({
      where: { id },
      relations: {
        testUnit: true,
        testType: true,
        categoryMappings: {
          category: true,
        },
      },
    });
    if (!test) {
      throw new Error('Test not found');
    }
    return test;
  }

  async updateTest(id: number, updateTestDto: UpdateTestDto) {
    const {
      name,
      price,
      testTypeId,
      testUnitId,
      normalRangeMin,
      normalRangeMax,
      categoryIds,
    } = updateTestDto;

    const test = await this.findOneTest(id);
    this.testRepo.merge(test, {
      name,
      price,
      normalRangeMin,
      normalRangeMax,
      testType: { id: Number(testTypeId) },
      testUnit: { id: Number(testUnitId) },
    });
    const updatedTest = await this.testRepo.save(test);

    if (categoryIds && categoryIds.length > 0) {
      const currentMapping = await this.testCategoryMapRepo.find({
        where: { test: { id: updatedTest.id } },
        relations: { category: true },
      });
      const currentCategoryIds = currentMapping.map((m) =>
        m.category.id.toString(),
      );
      //[1,2,3]
      const newCategoryIds = categoryIds.map((id) => id.toString());
      //[2,3,4]

      const categoriesChanged =
        currentCategoryIds.length !== newCategoryIds.length ||
        !currentCategoryIds.every((id) => newCategoryIds.includes(id)) ||
        !newCategoryIds.every((id) => currentCategoryIds.includes(id));
      if (categoriesChanged) {
        const toRemove = currentMapping.filter(
          (m) => !newCategoryIds.includes(m.category.id.toString()),
        );
        const toAdd = newCategoryIds.filter(
          (id) => !currentCategoryIds.includes(id),
        );

        await Promise.all([
          ...toRemove.map((mapping) =>
            this.testCategoryMapRepo.remove(mapping),
          ),
          ...toAdd.map((categoryId) =>
            this.createTestCategoryMap({
              testId: String(updatedTest.id),
              categoryId,
            }),
          ),
        ]);
      }
    }

    return await this.findOneTest(updatedTest.id);
  }

  async removeTest(id: number) {
    const tests = await this.findOneTest(id);
    return this.testRepo.remove(tests);
  }

  // TestUnit Services
  createTestUnit(createTestUnitDto: CreateTestUnitDto) {
    const newTestUnit = this.testUnitRepo.create(createTestUnitDto);
    return this.testUnitRepo.save(newTestUnit);
  }

  async findAllTestUnits() {
    return await this.testUnitRepo.find();
  }

  async findOneTestUnit(id: GlobalEntityIdDataType) {
    const testUnit = await this.testUnitRepo.findOne({
      where: { id },
    });
    if (!testUnit) {
      throw new Error('Test unit not found');
    }
    return testUnit;
  }

  async UpdateTestUnit(
    id: GlobalEntityIdDataType,
    updateTestUnitDto: Partial<CreateTestUnitDto>,
  ) {
    const testUnit = await this.findOneTestUnit(id);
    this.testUnitRepo.merge(testUnit, updateTestUnitDto);
    return await this.testUnitRepo.save(testUnit);
  }

  async removeTestUnit(id: GlobalEntityIdDataType) {
    const testUnit = await this.findOneTestUnit(id);
    return this.testUnitRepo.remove(testUnit);
  }

  // Test Type Service
  async createTestType(createTestTypeDto: CreateTestTypeDto) {
    const newTestType = this.testTypeRepo.create(createTestTypeDto);
    return await this.testTypeRepo.save(newTestType);
  }

  async findAllTestTypes() {
    return await this.testTypeRepo.find();
  }

  async findOneTestType(id: GlobalEntityIdDataType) {
    const testType = await this.testTypeRepo.findOne({
      where: { id },
    });
    if (!testType) {
      throw new Error('Test type not found');
    }
    return testType;
  }

  async UpdateTestType(
    id: GlobalEntityIdDataType,
    updateTestTypeDto: Partial<CreateTestTypeDto>,
  ) {
    const testType = await this.findOneTestType(id);
    this.testTypeRepo.merge(testType, updateTestTypeDto);
    return this.testTypeRepo.save(testType);
  }

  async removeTestType(id: GlobalEntityIdDataType) {
    const testType = await this.findOneTestType(id);
    return this.testTypeRepo.remove(testType);
  }

  // Test Category Services
  async createTestCategory(createTestCategoryDto: CreateTestCategoryDto) {
    const newTestCategory = this.testCategoryRepo.create(createTestCategoryDto);
    return await this.testCategoryRepo.save(newTestCategory);
  }

  async findAllTestCategories() {
    return await this.testCategoryRepo.find();
  }

  async findOneTestCategory(id: GlobalEntityIdDataType) {
    const testCategory = await this.testCategoryRepo.findOne({
      where: { id },
    });
    if (!testCategory) {
      throw new Error('Test category not found');
    }
    return testCategory;
  }
  async UpdateTestCategory(
    id: GlobalEntityIdDataType,
    updateTestCategoryDto: Partial<CreateTestCategoryDto>,
  ) {
    const testCategory = await this.findOneTestCategory(id);
    this.testCategoryRepo.merge(testCategory, updateTestCategoryDto);
    return await this.testCategoryRepo.save(testCategory);
  }
  async removeTestCategory(id: GlobalEntityIdDataType) {
    const testCategory = await this.findOneTestCategory(id);
    return this.testCategoryRepo.remove(testCategory);
  }

  // Test Category Mapping Services
  async createTestCategoryMap(
    createTestCategoryMapDto: CreateTestCategoryMapDto,
  ) {
    const test = await this.findOneTest(
      parseInt(createTestCategoryMapDto.testId),
    );

    const category = await this.findOneTestCategory(
      parseInt(createTestCategoryMapDto.categoryId),
    );

    const newTestCategoryMap = this.testCategoryMapRepo.create({
      test,
      category,
    });
    return await this.testCategoryMapRepo.save(newTestCategoryMap);
  }
  async removeAllTestCategoryMapForGivenTestId(testId: GlobalEntityIdDataType) {
    return await this.testCategoryMapRepo.delete({ test: { id: testId } });
  }

  async reomveOneTestCategoryMap(
    testId: GlobalEntityIdDataType,
    categoryId: GlobalEntityIdDataType,
  ) {
    return await this.testCategoryMapRepo.delete({
      test: { id: testId },
      category: { id: categoryId },
    });
  }
}
