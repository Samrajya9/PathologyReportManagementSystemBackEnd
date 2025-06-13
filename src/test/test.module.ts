import { forwardRef, Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './entities/test.entity';
import { TestUnitModule } from './modules/test-unit/test-unit.module';
import { TestCategoryModule } from './modules/test-category/test-category.module';
import { TestCategoryMapModule } from './modules/test-category-map/test-category-map.module';
import { TestFallbackModule } from './modules/test-fallback/test-fallback.module';
import { MedicalDepartmentsModule } from 'src/medical_departments/medical_departments.module';
import { ReferenceRangesModule } from './modules/reference_ranges/reference_ranges.module';
import { SpecimensModule } from 'src/specimens/specimens.module';
import { ResultValueOptionsModule } from './modules/result_value_options/result_value_options.module';
import { ResultValueTypesModule } from './modules/result_value_types/result_value_types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestEntity]),
    MedicalDepartmentsModule,
    TestUnitModule,
    TestCategoryModule,
    forwardRef(() => TestCategoryMapModule),
    forwardRef(() => TestFallbackModule),
    forwardRef(() => ReferenceRangesModule),
    SpecimensModule,
    ResultValueOptionsModule,
    ResultValueTypesModule,
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
