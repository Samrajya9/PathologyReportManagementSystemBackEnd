import { PartialType } from '@nestjs/mapped-types';
import { CreateTestCategoryMappingDto } from './create-test-category-mapping.dto';

export class UpdateTestCategoryMappingDto extends PartialType(CreateTestCategoryMappingDto) {}
