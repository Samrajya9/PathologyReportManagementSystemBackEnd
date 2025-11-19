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
import { SearchTestDto } from './dto/search-test.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ResponseMessage('Successfully Created Test')
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.createTest(createTestDto);
  }

  @Get('search')
  async search(@Query() query: SearchTestDto) {
    return this.testService.searchTests(query);
  }
  @Get()
  @ResponseMessage('Successfully fetched tests')
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    return this.testService.findAllTest(pageNumber, limitNumber);
  }

  @Get(':id')
  @ResponseMessage('Successfully fetched test')
  findOne(@Param('id') id: number) {
    return this.testService.findOne(id);
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
