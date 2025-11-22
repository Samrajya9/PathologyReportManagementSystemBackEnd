import { Test, TestingModule } from '@nestjs/testing';
import { TestRequestsService } from './test-requests.service';

describe('TestRequestsService', () => {
  let service: TestRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestRequestsService],
    }).compile();

    service = module.get<TestRequestsService>(TestRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
