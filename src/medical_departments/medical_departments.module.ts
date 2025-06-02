import { Module } from '@nestjs/common';
import { MedicalDepartmentsService } from './medical_departments.service';
import { MedicalDepartmentsController } from './medical_departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalDepartmentEntity } from './entities/medical_department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalDepartmentEntity])],
  controllers: [MedicalDepartmentsController],
  providers: [MedicalDepartmentsService],
  exports: [MedicalDepartmentsService],
})
export class MedicalDepartmentsModule {}
