import { Injectable } from '@nestjs/common';
import { CreateOrderTestDto } from './dto/create-order_test.dto';
import { UpdateOrderTestDto } from './dto/update-order_test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTestsEntity } from './entities/order_test.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderTestsService {
  constructor(
    @InjectRepository(OrderTestsEntity)
    private readonly orderTestsRepo: Repository<OrderTestsEntity>,
  ) {}

  create(createOrderTestDto: CreateOrderTestDto) {
    const newOrderTest = this.orderTestsRepo.create({
      testOrder: { id: createOrderTestDto.testOrderId },
      test: { id: createOrderTestDto.testId },
    });
    return this.orderTestsRepo.save(newOrderTest);
  }

  async findByTestOrderId(testOrderId: number) {
    const testOrder = await this.orderTestsRepo.find({
      where: { testOrder: { id: testOrderId } },
      relations: ['test'],
    });
    return testOrder.map((item) => {
      const { test, ...rest } = item;
      const {
        resultValueOptions,
        referenceRanges,
        medicalDepartment,
        testUnit,
        ...testWithoutExtras
      } = test;
      return {
        ...rest,
        test: testWithoutExtras,
      };
    });
  }

  findAll() {
    return `This action returns all orderTests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderTest`;
  }

  update(id: number, updateOrderTestDto: UpdateOrderTestDto) {
    return `This action updates a #${id} orderTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderTest`;
  }
}
