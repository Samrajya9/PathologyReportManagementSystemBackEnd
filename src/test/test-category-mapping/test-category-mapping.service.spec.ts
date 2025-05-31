import { Test, TestingModule } from '@nestjs/testing';
import { TestCategoryMappingService } from './test-category-mapping.service';

describe('TestCategoryMappingService', () => {
  let service: TestCategoryMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestCategoryMappingService],
    }).compile();

    service = module.get<TestCategoryMappingService>(TestCategoryMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
