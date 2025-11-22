import { Routes } from '@nestjs/core';
import { ContainerModule } from '@modules/container/container.module';
import { MedicalDepartmentsModule } from '@modules/medical_departments/medical_departments.module';
import { SpecimensModule } from '@modules/specimens/specimens.module';
import { ResultValueTypesModule } from '@modules/test/modules/result_value_types/result_value_types.module';
import { TestUnitModule } from '@modules/test/modules/test-unit/test-unit.module';
import { PanelsModule } from '@modules/panels/panels.module';
import { TestModule } from '@modules/test/test.module';

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
