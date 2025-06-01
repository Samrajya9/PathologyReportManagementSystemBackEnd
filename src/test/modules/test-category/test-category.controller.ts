import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TestCategoryService } from './test-category.service';
import { CreateTestCategoryDto } from './dto/create-test-category.dto';
import { UpdateTestCategoryDto } from './dto/update-test-category.dto';

@Controller()
export class TestCategoryController {
  constructor(private readonly testCategoryService: TestCategoryService) {}

  @Post()
  create(@Body() createTestCategoryDto: CreateTestCategoryDto) {
    console.log('Hi');
    return this.testCategoryService.create(createTestCategoryDto);
  }

  @Get()
  findAll() {
    console.log('Geting all test');
    return this.testCategoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // Use ParseIntPipe
    return this.testCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestCategoryDto: UpdateTestCategoryDto,
  ) {
    return this.testCategoryService.update(+id, updateTestCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCategoryService.remove(+id);
  }
}
