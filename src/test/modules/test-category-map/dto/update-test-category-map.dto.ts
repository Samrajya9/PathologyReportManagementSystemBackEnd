import { PartialType } from '@nestjs/mapped-types';
import { CreateTestCategoryMapDto } from './create-test-category-map.dto';

export class UpdateTestCategoryMapDto extends PartialType(CreateTestCategoryMapDto) {}
