import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestOrderDto } from './dto/create-test_order.dto';
import { UpdateTestOrderDto } from './dto/update-test_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestOrdersEntity } from './entities/test_order.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { OrderTestsService } from '@modules/order_tests/order_tests.service';

@Injectable()
export class TestOrdersService {
  constructor(
    @InjectRepository(TestOrdersEntity)
    private readonly testOrdersRepo: Repository<TestOrdersEntity>,
    private readonly orderTestsService: OrderTestsService,
  ) {}

  async create(createTestOrderDto: CreateTestOrderDto, userID: number) {
    const newTestOrder = this.testOrdersRepo.create({
      user: {
        id: userID,
      },
    });
    const testOrder = await this.testOrdersRepo.save(newTestOrder);
    const testOrderId = testOrder.id;
    const testIds = createTestOrderDto.testIds;

    for (const testId of testIds) {
      await this.orderTestsService.create({ testOrderId, testId });
    }
    return testOrder;
  }

  async findAll(page: number, limit: number) {
    const findAllOptions: FindManyOptions<TestOrdersEntity> = {
      take: limit,
      skip: (page - 1) * limit,
    };

    const [data, total] =
      await this.testOrdersRepo.findAndCount(findAllOptions);
    console.log(data);

    const fullData = await Promise.all(
      data.map(async (order) => {
        const orderId = order.id;
        const orderItems =
          await this.orderTestsService.findByTestOrderId(orderId);
        return { ...order, orderItems };
      }),
    );

    return {
      orders: fullData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const data = await this.testOrdersRepo.findOne({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('Test Order not found');
    }
    const orderItems = await this.orderTestsService.findByTestOrderId(data.id);
    return { ...data, orderItems };
  }

  update(id: number, updateTestOrderDto: UpdateTestOrderDto) {
    return `This action updates a #${id} testOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} testOrder`;
  }
}
