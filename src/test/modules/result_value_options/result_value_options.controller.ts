import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResultValueOptionsService } from './result_value_options.service';
import { CreateResultValueOptionDto } from './dto/create-result_value_option.dto';
import { UpdateResultValueOptionDto } from './dto/update-result_value_option.dto';

@Controller('result-value-options') // Ensure this has a specific prefix
export class ResultValueOptionsController {
  constructor(
    private readonly resultValueOptionsService: ResultValueOptionsService,
  ) {}

  @Post()
  create(
    @Body()
    createResultValueOptionDto: CreateResultValueOptionDto,
  ) {
    return this.resultValueOptionsService.createFromUrl(
      createResultValueOptionDto,
    );
  }

  @Get()
  findAll() {
    return this.resultValueOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultValueOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResultValueOptionDto: UpdateResultValueOptionDto,
  ) {
    return this.resultValueOptionsService.update(
      +id,
      updateResultValueOptionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultValueOptionsService.remove(+id);
  }
}
