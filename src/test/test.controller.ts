import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { CreateTestUnitDto } from './dto/create-test-unit.dto';
import { CreateTestTypeDto } from './dto/create-test-type.dto';
import { CreateTestCategoryDto } from './dto/create-test-category.dto';
import { GlobalEntityIdDataType } from 'src/global/entity/BaseEntity';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  // Tests Unit Controllers
  @Post('/units')
  createTestUnit(@Body() createTestUnitDto: CreateTestUnitDto) {
    return this.testService.createTestUnit(createTestUnitDto);
  }

  @Get('/units')
  findAllTestUnit() {
    return this.testService.findAllTestUnits();
  }
  @Get('/units/:id')
  findOneTestUnit(@Param('id') id: string) {
    return this.testService.findOneTestUnit(+id);
  }

  @Patch('/units/:id')
  updateTestUnit(
    @Param('id', ParseIntPipe) id: GlobalEntityIdDataType,
    @Body() updateTestUnitDto: Partial<CreateTestUnitDto>,
  ) {
    return this.testService.UpdateTestUnit(id, updateTestUnitDto);
  }

  @Delete('/units/:id')
  removeTestUnit(@Param('id', ParseIntPipe) id: GlobalEntityIdDataType) {
    return this.testService.removeTestUnit(id);
  }

  //Tests Type Controllers
  @Post('/types')
  createTestType(@Body() createTestTypeDto: CreateTestTypeDto) {
    return this.testService.createTestType(createTestTypeDto);
  }

  @Get('/types')
  findAllTestType() {
    return this.testService.findAllTestTypes();
  }

  @Get('/types/:id')
  findOneTestType(@Param('id') id: string) {
    return this.testService.findOneTestType(+id);
  }
  @Patch('/types/:id')
  updateTestType(
    @Param('id') id: string,
    @Body() updateTestTypeDto: Partial<CreateTestTypeDto>,
  ) {
    return this.testService.UpdateTestType(+id, updateTestTypeDto);
  }

  @Delete('/types/:id')
  removeTestType(@Param('id') id: string) {
    return this.testService.removeTestType(+id);
  }

  // Tests Category Controllers
  @Post('/categories')
  createTestCategory(@Body() createTestCategoryDto: CreateTestCategoryDto) {
    return this.testService.createTestCategory(createTestCategoryDto);
  }
  @Get('/categories')
  findAllTestCategory() {
    return this.testService.findAllTestCategories();
  }
  @Get('/categories/:id')
  findOneTestCategory(@Param('id') id: string) {
    return this.testService.findOneTestCategory(+id);
  }
  @Patch('/categories/:id')
  updateTestCategory(
    @Param('id') id: string,
    @Body() updateTestCategoryDto: Partial<CreateTestCategoryDto>,
  ) {
    return this.testService.UpdateTestCategory(+id, updateTestCategoryDto);
  }
  @Delete('/categories/:id')
  removeTestCategory(@Param('id') id: string) {
    return this.testService.removeTestCategory(+id);
  }

  // Tests Controllers
  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.createTest(createTestDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.testService.findAllTest(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOneTest(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.updateTest(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.removeTest(+id);
  }
}
