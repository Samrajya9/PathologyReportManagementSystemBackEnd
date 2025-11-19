import { AppBaseEntity } from '@common/entity/BaseEntity';
import { OrderTestResultsEntity } from '@modules/test-result/entities/test-result.entity';
import { TestEntity } from '@modules/test/entities/test.entity';
import { TestOrdersEntity } from '@modules/test_orders/entities/test_order.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

export enum TestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('order_tests')
export class OrderTestsEntity extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: TestStatus,
    default: TestStatus.PENDING,
  })
  status: TestStatus;

  @ManyToOne(() => TestOrdersEntity, (testOrder) => testOrder.testOrderTests, {
    onDelete: 'CASCADE',
  })
  testOrder: TestOrdersEntity;

  @ManyToOne(() => TestEntity, { onDelete: 'RESTRICT' })
  test: TestEntity;

  @OneToOne(() => OrderTestResultsEntity, (result) => result.testOrderTest)
  result: OrderTestResultsEntity;
}
