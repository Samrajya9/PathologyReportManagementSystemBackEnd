import { AppBaseEntity } from '@common/entity/BaseEntity';
import { OrderTestsEntity } from '@modules/order_tests/entities/order_test.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity('order_test_results')
export class OrderTestResultsEntity extends AppBaseEntity {
  // Relations
  @OneToOne(() => OrderTestsEntity, (testOrderTest) => testOrderTest.result, {
    onDelete: 'CASCADE',
  })
  //   @JoinColumn({ name: 'testOrderTestId' })
  testOrderTest: OrderTestsEntity;

  @Column({ type: 'text', nullable: true })
  resultValue: string;
}
