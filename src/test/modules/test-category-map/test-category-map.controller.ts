import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestCategoryMapService } from './test-category-map.service';
import { CreateTestCategoryMapDto } from './dto/create-test-category-map.dto';
import { UpdateTestCategoryMapDto } from './dto/update-test-category-map.dto';

@Controller('test/test-category-map')
export class TestCategoryMapController {
  constructor(
    private readonly testCategoryMapService: TestCategoryMapService,
  ) {}

  @Post()
  create(@Body() createTestCategoryMapDto: CreateTestCategoryMapDto) {
    return this.testCategoryMapService.create(createTestCategoryMapDto);
  }

  @Get()
  findAll() {
    return this.testCategoryMapService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestCategoryMapDto: UpdateTestCategoryMapDto,
  ) {
    return this.testCategoryMapService.update(+id, updateTestCategoryMapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCategoryMapService.remove(+id);
  }
}
