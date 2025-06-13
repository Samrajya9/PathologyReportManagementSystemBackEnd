import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResultValueTypesService } from './result_value_types.service';
import { CreateResultValueTypeDto } from './dto/create-result_value_type.dto';
import { UpdateResultValueTypeDto } from './dto/update-result_value_type.dto';

@Controller('')
export class ResultValueTypesController {
  constructor(
    private readonly resultValueTypesService: ResultValueTypesService,
  ) {}

  @Post()
  create(@Body() createResultValueTypeDto: CreateResultValueTypeDto) {
    return this.resultValueTypesService.create(createResultValueTypeDto);
  }

  @Get()
  findAll() {
    return this.resultValueTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultValueTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResultValueTypeDto: UpdateResultValueTypeDto,
  ) {
    return this.resultValueTypesService.update(+id, updateResultValueTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultValueTypesService.remove(+id);
  }
}
