import { forwardRef, Module } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { PanelsController } from './panels.controller';
import { PanelTestsModule } from './modules/panel_tests/panel_tests.module';
import { MedicalDepartmentsModule } from 'src/medical_departments/medical_departments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelEntity } from './entities/panel.entity';

@Module({
  imports: [
    forwardRef(() => PanelTestsModule),
    MedicalDepartmentsModule,
    TypeOrmModule.forFeature([PanelEntity]),
  ],
  controllers: [PanelsController],
  providers: [PanelsService],
  exports: [PanelsService],
})
export class PanelsModule {}
