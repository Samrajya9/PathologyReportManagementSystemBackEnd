import {
  AppBaseEntity,
  AppBaseEntityIdDataType,
} from '@common/entity/BaseEntity';
import { TestEntity } from '@modules/test/entities/test.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { TestRequestEntity } from './test-request.entity';
import { TestResultEntity } from './test-result.entity';

export enum TestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('requested_tests')
export class RequestedTestEntity extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: TestStatus,
    default: TestStatus.PENDING,
  })
  status: TestStatus;

  //--------------------------------------------------------
  @Column()
  @Index()
  testRequestId: AppBaseEntityIdDataType;
  @ManyToOne(
    () => TestRequestEntity,
    (testRequest) => testRequest.requestedTests,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'testRequestId' })
  testRequest: TestRequestEntity;
  //--------------------------------------------------------

  @Column()
  @Index()
  testId: AppBaseEntityIdDataType;
  // Relations
  @ManyToOne(() => TestEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'testId' })
  test: TestEntity;

  @OneToOne(() => TestResultEntity, (result) => result.requestedTest)
  result: TestResultEntity;
}
