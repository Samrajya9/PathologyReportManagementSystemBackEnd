import { forwardRef, Module } from '@nestjs/common';
import { TestCategoryMapService } from './test-category-map.service';
import { TestCategoryMapController } from './test-category-map.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCategoryMapEntity } from './entities/test-category-map.entity';
import { TestCategoryModule } from '../test-category/test-category.module';
import { TestModule } from '@modules/test/test.module';

@Module({
  imports: [
    forwardRef(() => TestModule),
    TestCategoryModule,
    TypeOrmModule.forFeature([TestCategoryMapEntity]),
  ],
  controllers: [TestCategoryMapController],
  providers: [TestCategoryMapService],
  exports: [TestCategoryMapService],
})
export class TestCategoryMapModule {}
