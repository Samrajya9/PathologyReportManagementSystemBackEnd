import { PartialType } from '@nestjs/mapped-types';
import { CreateTestCategoryDto } from './create-test-category.dto';

export class UpdateTestCategoryDto extends PartialType(CreateTestCategoryDto) {}
