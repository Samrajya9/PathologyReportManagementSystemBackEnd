import { Module } from '@nestjs/common';
import { OrderTestsService } from './order_tests.service';
import { OrderTestsController } from './order_tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTestsEntity } from './entities/order_test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTestsEntity])],
  controllers: [OrderTestsController],
  providers: [OrderTestsService],
  exports: [OrderTestsService],
})
export class OrderTestsModule {}
