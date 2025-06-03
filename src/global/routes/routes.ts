import { Routes } from '@nestjs/core';
import { MedicalDepartmentsModule } from 'src/medical_departments/medical_departments.module';
import { PanelsModule } from 'src/panels/panels.module';
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
