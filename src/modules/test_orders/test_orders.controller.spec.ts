import { Test, TestingModule } from '@nestjs/testing';
import { TestOrdersController } from './test_orders.controller';
import { TestOrdersService } from './test_orders.service';

describe('TestOrdersController', () => {
  let controller: TestOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestOrdersController],
      providers: [TestOrdersService],
    }).compile();

    controller = module.get<TestOrdersController>(TestOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
