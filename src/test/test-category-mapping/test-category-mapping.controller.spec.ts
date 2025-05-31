import { Test, TestingModule } from '@nestjs/testing';
import { TestCategoryMappingController } from './test-category-mapping.controller';
import { TestCategoryMappingService } from './test-category-mapping.service';

describe('TestCategoryMappingController', () => {
  let controller: TestCategoryMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestCategoryMappingController],
      providers: [TestCategoryMappingService],
    }).compile();

    controller = module.get<TestCategoryMappingController>(TestCategoryMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
