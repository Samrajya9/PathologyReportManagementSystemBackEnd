import { AppBaseEntity } from '@common/entity/BaseEntity';
import { OrderTestsEntity } from '@modules/order_tests/entities/order_test.entity';
import { AppUserEntity } from '@modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export enum TestOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('test_orders')
export class TestOrdersEntity extends AppBaseEntity {
  @Column()
  userId: number;

  // Relations
  @ManyToOne(() => AppUserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: AppUserEntity;

  @Column({
    type: 'enum',
    enum: TestOrderStatus,
    default: TestOrderStatus.PENDING,
  })
  status: TestOrderStatus;

  @OneToMany(() => OrderTestsEntity, (testOrderTest) => testOrderTest.testOrder)
  testOrderTests: OrderTestsEntity[];
}
