import { Controller } from '@nestjs/common';
import { TestCategoryService } from './test-category.service';

@Controller('test-category')
export class TestCategoryController {
  constructor(private readonly testCategoryService: TestCategoryService) {}
}
