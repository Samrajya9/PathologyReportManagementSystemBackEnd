import { Routes } from '@nestjs/core';
import { MedicalDepartmentsModule } from 'src/medical_departments/medical_departments.module';
import { PanelsModule } from 'src/panels/panels.module';
import { ResultValueOptionsModule } from 'src/test/modules/result_value_options/result_value_options.module';
import { ResultValueTypesModule } from 'src/test/modules/result_value_types/result_value_types.module';
import { TestCategoryModule } from 'src/test/modules/test-category/test-category.module';
import { TestFallbackModule } from 'src/test/modules/test-fallback/test-fallback.module';
import { TestUnitModule } from 'src/test/modules/test-unit/test-unit.module';
import { TestModule } from 'src/test/test.module';

export const AppRoutes: Routes = [
  {
    path: 'tests',
    children: [
      { path: 'units', module: TestUnitModule },
      { path: 'categories', module: TestCategoryModule },
      { path: '/', module: TestModule },
      { path: '/', module: TestFallbackModule },
      { path: 'result-value-options', module: ResultValueOptionsModule },
      { path: 'result-value-types', module: ResultValueTypesModule },
    ],
  },
  {
    path: 'medical_departments',
    module: MedicalDepartmentsModule,
  },
  {
    path: 'panels',
    module: PanelsModule,
  },
];
