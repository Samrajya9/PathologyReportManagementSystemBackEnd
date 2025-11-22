import {
  AppBaseEntity,
  AppBaseEntityIdDataType,
} from '@common/entity/BaseEntity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { RequestedTestEntity } from './requested-test.entity';

@Entity('test_results')
export class TestResultEntity extends AppBaseEntity {
  @Column()
  @Index()
  requestedTestId: AppBaseEntityIdDataType;
  // Relations
  @OneToOne(
    () => RequestedTestEntity,
    (requestedTest) => requestedTest.result,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'requestedTestId' })
  requestedTest: RequestedTestEntity;

  @Column({ type: 'text', nullable: true })
  resultValue: string;
}
