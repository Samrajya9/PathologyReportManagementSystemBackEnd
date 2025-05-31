import { Module } from '@nestjs/common';
import { TestCategoryMappingService } from './test-category-mapping.service';
import { TestCategoryMappingController } from './test-category-mapping.controller';

@Module({
  controllers: [TestCategoryMappingController],
  providers: [TestCategoryMappingService],
})
export class TestCategoryMappingModule {}
