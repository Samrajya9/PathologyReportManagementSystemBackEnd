import { Controller, Get } from '@nestjs/common';
import { ResultValueTypesService } from './result_value_types.service';

@Controller()
export class ResultValueTypesController {
  constructor(
    private readonly resultValueTypesService: ResultValueTypesService,
  ) {}
  @Get()
  findAll() {
    return this.resultValueTypesService.findAll();
  }
}
