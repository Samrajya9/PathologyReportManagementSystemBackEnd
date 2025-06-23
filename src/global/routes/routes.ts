import { Routes } from '@nestjs/core';
import { ContainerModule } from 'src/container/container.module';
import { MedicalDepartmentsModule } from 'src/medical_departments/medical_departments.module';
import { PanelsModule } from 'src/panels/panels.module';
import { SpecimensModule } from 'src/specimens/specimens.module';
import { ResultValueTypesModule } from 'src/test/modules/result_value_types/result_value_types.module';
import { TestCategoryModule } from 'src/test/modules/test-category/test-category.module';
import { TestUnitModule } from 'src/test/modules/test-unit/test-unit.module';
import { TestModule } from 'src/test/test.module';

export const AppRoutes: Routes = [
  {
    path: 'test-result-value-types',
    module: ResultValueTypesModule,
  },
  {
    path: 'test-units',
    module: TestUnitModule,
  },
  {
    path: 'test-categories',
    module: TestCategoryModule,
  },
  {
    path: 'medical_departments',
    module: MedicalDepartmentsModule,
  },

  {
    path: 'panels',
    module: PanelsModule,
  },

  {
    path: 'test-specimens',
    module: SpecimensModule,
  },
  {
    path: 'test-containers',
    module: ContainerModule,
  },
  {
    path: 'tests',
    module: TestModule,
  },
];
