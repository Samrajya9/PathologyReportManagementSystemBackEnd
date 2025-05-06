import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  async create(createTestDto: CreateTestDto) {
    const newTest = this.testRepo.create(createTestDto);
    const test = await this.testRepo.save(newTest);
    const testCategoryMap = createTestDto.categoryIds.map((categoryId) => {
      return this.createTestCategoryMap({
        testId: String(test.id),
        categoryId,
      });
    });
    await Promise.all(testCategoryMap);
    return test;
  }

  findAll() {
    return this.testRepo.find({
      relations: {
        testUnit: true,
        tesType: true,
      },
    });
  }

  async findOne(id: number) {
    const test = await this.testRepo.findOne({
      where: { id },
    });
    if (!test) {
      throw new Error('Test not found');
    }
    return test;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
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
    // const test = await this.testRepo.findOne({
    //   where: { id: parseInt(createTestCategoryMapDto.testId) },
    // });
    // const category = await this.testCategoryRepo.findOne({
    //   where: { id: parseInt(createTestCategoryMapDto.categoryId) },
    // });
    const test = await this.findOne(parseInt(createTestCategoryMapDto.testId));

    const category = await this.findOneTestCategory(
      parseInt(createTestCategoryMapDto.categoryId),
    );

    const newTestCategoryMap = this.testCategoryMapRepo.create({
      test,
      category,
    });
    return await this.testCategoryMapRepo.save(newTestCategoryMap);
  }
}
