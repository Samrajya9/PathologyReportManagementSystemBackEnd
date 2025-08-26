import { Test, TestingModule } from '@nestjs/testing';
import { TestFallbackService } from './test-fallback.service';

describe('TestFallbackService', () => {
  let service: TestFallbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestFallbackService],
    }).compile();

    service = module.get<TestFallbackService>(TestFallbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
