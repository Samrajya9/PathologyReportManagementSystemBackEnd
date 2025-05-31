import { Injectable } from '@nestjs/common';
import { CreateTestCategoryMappingDto } from './dto/create-test-category-mapping.dto';
import { UpdateTestCategoryMappingDto } from './dto/update-test-category-mapping.dto';

@Injectable()
export class TestCategoryMappingService {
  create(createTestCategoryMappingDto: CreateTestCategoryMappingDto) {
    return 'This action adds a new testCategoryMapping';
  }

  findAll() {
    return `This action returns all testCategoryMapping`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testCategoryMapping`;
  }

  update(id: number, updateTestCategoryMappingDto: UpdateTestCategoryMappingDto) {
    return `This action updates a #${id} testCategoryMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} testCategoryMapping`;
  }
}
