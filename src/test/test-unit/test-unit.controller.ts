import { Controller } from '@nestjs/common';
import { TestUnitService } from './test-unit.service';

@Controller('test-unit')
export class TestUnitController {
  constructor(private readonly testUnitService: TestUnitService) {}
}
