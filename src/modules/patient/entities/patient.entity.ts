import {
  AppBaseEntity,
  AppBaseEntityIdDataType,
} from '@common/entity/BaseEntity';
import { AppUserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { PatientProfileEntity } from './patient-profile.entity';

export enum PatientCreatedBy {
  ADMIN = 'admin',
  PARTNER = 'partner',
  USER = 'user',
}

@Entity('patients')
export class PatientEntity extends AppBaseEntity {
  @Column({ type: 'enum', enum: PatientCreatedBy })
  createdBy: PatientCreatedBy;

  @Column()
  createdById: AppBaseEntityIdDataType;

  @Column({ nullable: true })
  ownedById: AppBaseEntityIdDataType;

  @ManyToOne(() => AppUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownedById' })
  owner: AppUserEntity;

  @OneToOne(() => PatientProfileEntity, (profile) => profile.patient)
  profile: PatientProfileEntity;
}
