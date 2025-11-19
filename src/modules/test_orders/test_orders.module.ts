import { Module } from '@nestjs/common';
import { TestOrdersService } from './test_orders.service';
import { TestOrdersController } from './test_orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestOrdersEntity } from './entities/test_order.entity';
import { OrderTestsModule } from '@modules/order_tests/order_tests.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestOrdersEntity]), OrderTestsModule],
  controllers: [TestOrdersController],
  providers: [TestOrdersService],
})
export class TestOrdersModule {}
