import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entities/patient.entity';
import { PatientProfileEntity } from './entities/patient-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, PatientProfileEntity])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
