import { forwardRef, Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './entities/test.entity';
import { TestUnitModule } from './modules/test-unit/test-unit.module';
import { TestTypeModule } from './modules/test-type/test-type.module';
import { TestCategoryModule } from './modules/test-category/test-category.module';
import { TestCategoryMapModule } from './modules/test-category-map/test-category-map.module';
import { TestUnitController } from './modules/test-unit/test-unit.controller';
import { TestFallbackModule } from './modules/test-fallback/test-fallback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestEntity]),
    TestUnitModule,
    TestTypeModule,
    TestCategoryModule,
    forwardRef(() => TestCategoryMapModule),
    forwardRef(() => TestFallbackModule),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
