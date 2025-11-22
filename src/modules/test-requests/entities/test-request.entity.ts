import {
  AppBaseEntity,
  AppBaseEntityIdDataType,
} from '@common/entity/BaseEntity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RequestedTestEntity } from './requested-test.entity';
import { PatientEntity } from '@modules/patient/entities/patient.entity';

export enum TestRequestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('test_requests')
export class TestRequestEntity extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: TestRequestStatus,
    default: TestRequestStatus.PENDING,
  })
  status: TestRequestStatus;

  @Column()
  @Index()
  patientId: AppBaseEntityIdDataType;
  // Relations
  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @OneToMany(
    () => RequestedTestEntity,
    (requestedTests) => requestedTests.testRequest,
  )
  requestedTests: RequestedTestEntity[];
}
