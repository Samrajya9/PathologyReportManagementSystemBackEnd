import { Test, TestingModule } from '@nestjs/testing';
import { OrderTestsService } from './order_tests.service';

describe('OrderTestsService', () => {
  let service: OrderTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderTestsService],
    }).compile();

    service = module.get<OrderTestsService>(OrderTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
