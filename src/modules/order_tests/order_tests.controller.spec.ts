import { Test, TestingModule } from '@nestjs/testing';
import { OrderTestsController } from './order_tests.controller';
import { OrderTestsService } from './order_tests.service';

describe('OrderTestsController', () => {
  let controller: OrderTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderTestsController],
      providers: [OrderTestsService],
    }).compile();

    controller = module.get<OrderTestsController>(OrderTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
