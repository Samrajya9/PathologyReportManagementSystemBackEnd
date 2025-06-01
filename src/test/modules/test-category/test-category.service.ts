import { Injectable } from '@nestjs/common';
import { CreateTestCategoryDto } from './dto/create-test-category.dto';
import { UpdateTestCategoryDto } from './dto/update-test-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCategoryEntity } from './entities/test-category.entity';
import { Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';

@Injectable()
export class TestCategoryService {
  constructor(
    @InjectRepository(TestCategoryEntity)
    private readonly testCategoryRepo: Repository<TestCategoryEntity>,
  ) {}
  async create(createTestCategoryDto: CreateTestCategoryDto) {
    const newTestCategory = this.testCategoryRepo.create(createTestCategoryDto);
    const result = await this.testCategoryRepo.save(newTestCategory);
    return result;
  }

  async findAll() {
    return await this.testCategoryRepo.find();
  }

  async findOne(id: AppBaseEntityIdDataType) {
    const testCategory = await this.testCategoryRepo.findOne({
      where: { id },
    });
    if (!testCategory) {
      throw new Error(`Test category with ${id} not found`);
    }
    return testCategory;
  }

  async update(
    id: AppBaseEntityIdDataType,
    updateTestCategoryDto: UpdateTestCategoryDto,
  ) {
    const testCategory = await this.findOne(id);
    const updatedTestCategory = this.testCategoryRepo.merge(
      testCategory,
      updateTestCategoryDto,
    );
    return await this.testCategoryRepo.save(updatedTestCategory);
  }

  async remove(id: AppBaseEntityIdDataType) {
    return await this.testCategoryRepo.delete({ id });
  }
}
