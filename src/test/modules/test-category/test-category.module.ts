import { Module } from '@nestjs/common';
import { TestCategoryService } from './test-category.service';
import { TestCategoryController } from './test-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCategoryEntity } from './entities/test-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestCategoryEntity])],
  controllers: [TestCategoryController],
  providers: [TestCategoryService],
  exports: [TestCategoryService],
})
export class TestCategoryModule {}
