import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTestCategoryMapDto } from './dto/create-test-category-map.dto';
import { UpdateTestCategoryMapDto } from './dto/update-test-category-map.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCategoryMapEntity } from './entities/test-category-map.entity';
import { Repository } from 'typeorm';
import { TestCategoryService } from '../test-category/test-category.service';
import { TestService } from 'src/test/test.service';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';

@Injectable()
export class TestCategoryMapService {
  constructor(
    @InjectRepository(TestCategoryMapEntity)
    private readonly testCategoryMapRepo: Repository<TestCategoryMapEntity>,
    private readonly testCategoryService: TestCategoryService,
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}

  async create(createTestCategoryMapDto: CreateTestCategoryMapDto) {
    const { testId, categoryId } = createTestCategoryMapDto;
    const test = await this.testService.findOne(testId);
    const category = await this.testCategoryService.findOne(categoryId);
    const newTestCategoryMap = this.testCategoryMapRepo.create({
      test,
      category,
    });
    const result = await this.testCategoryMapRepo.save(newTestCategoryMap);
    return result;
  }

  async findAll() {
    return await this.testCategoryMapRepo.find();
  }

  async findAllCategoryForTestByTestId(testId: AppBaseEntityIdDataType) {
    return await this.testCategoryMapRepo.find({
      where: { test: { id: testId } },
      relations: { category: true },
    });
  }

  update(
    id: AppBaseEntityIdDataType,
    updateTestCategoryMapDto: UpdateTestCategoryMapDto,
  ) {}

  async remove(id: AppBaseEntityIdDataType) {
    return await this.testCategoryMapRepo.delete([id]);
  }
  async removeAllTestCategoryMapForGivenTestId(
    testId: AppBaseEntityIdDataType,
  ) {
    return await this.testCategoryMapRepo.delete({ test: { id: testId } });
  }

  async reomveOneTestCategoryMap(
    testId: AppBaseEntityIdDataType,
    categoryId: AppBaseEntityIdDataType,
  ) {
    return await this.testCategoryMapRepo.delete({
      test: { id: testId },
      category: { id: categoryId },
    });
  }
}
