import { Controller } from '@nestjs/common';
import { TestTypeService } from './test-type.service';

@Controller('test-type')
export class TestTypeController {
  constructor(private readonly testTypeService: TestTypeService) {}
}
