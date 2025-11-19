import { Test, TestingModule } from '@nestjs/testing';
import { TestOrdersService } from './test_orders.service';

describe('TestOrdersService', () => {
  let service: TestOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestOrdersService],
    }).compile();

    service = module.get<TestOrdersService>(TestOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
