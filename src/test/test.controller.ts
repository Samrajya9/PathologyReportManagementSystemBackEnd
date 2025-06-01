//src/test/test.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  // Tests Controllers
  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.createTest(createTestDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 5;
    return this.testService.findAllTest(pageNumber, limitNumber);
  }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   console.log('Inside TestController ');
  //   return this.testService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.updateTest(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.removeTest(+id);
  }
}
