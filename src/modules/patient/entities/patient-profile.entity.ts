import { AppBaseEntity } from '@common/entity/BaseEntity';
import { PatientEntity } from './patient.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('patient_profiles')
export class PatientProfileEntity extends AppBaseEntity {
  @OneToOne(() => PatientEntity, (patient) => patient.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @Column()
  fullName: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;
}
