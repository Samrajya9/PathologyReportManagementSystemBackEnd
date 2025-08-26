import { Test, TestingModule } from '@nestjs/testing';
import { TestCategoryMapService } from './test-category-map.service';

describe('TestCategoryMapService', () => {
  let service: TestCategoryMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestCategoryMapService],
    }).compile();

    service = module.get<TestCategoryMapService>(TestCategoryMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
