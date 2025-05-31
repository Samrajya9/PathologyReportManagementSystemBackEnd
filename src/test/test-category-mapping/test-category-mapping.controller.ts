import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestCategoryMappingService } from './test-category-mapping.service';
import { CreateTestCategoryMappingDto } from './dto/create-test-category-mapping.dto';
import { UpdateTestCategoryMappingDto } from './dto/update-test-category-mapping.dto';

@Controller('test-category-mapping')
export class TestCategoryMappingController {
  constructor(private readonly testCategoryMappingService: TestCategoryMappingService) {}

  @Post()
  create(@Body() createTestCategoryMappingDto: CreateTestCategoryMappingDto) {
    return this.testCategoryMappingService.create(createTestCategoryMappingDto);
  }

  @Get()
  findAll() {
    return this.testCategoryMappingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testCategoryMappingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestCategoryMappingDto: UpdateTestCategoryMappingDto) {
    return this.testCategoryMappingService.update(+id, updateTestCategoryMappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCategoryMappingService.remove(+id);
  }
}
