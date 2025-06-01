import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestTypeService } from './test-type.service';
import { CreateTestTypeDto } from './dto/create-test-type.dto';
import { UpdateTestTypeDto } from './dto/update-test-type.dto';

@Controller('')
export class TestTypeController {
  constructor(private readonly testTypeService: TestTypeService) {}

  @Post()
  create(@Body() createTestTypeDto: CreateTestTypeDto) {
    return this.testTypeService.create(createTestTypeDto);
  }

  @Get()
  findAll() {
    return this.testTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestTypeDto: UpdateTestTypeDto,
  ) {
    return this.testTypeService.update(+id, updateTestTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testTypeService.remove(+id);
  }
}
