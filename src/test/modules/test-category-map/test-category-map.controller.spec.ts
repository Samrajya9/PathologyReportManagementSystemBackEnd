import { Test, TestingModule } from '@nestjs/testing';
import { TestCategoryMapController } from './test-category-map.controller';
import { TestCategoryMapService } from './test-category-map.service';

describe('TestCategoryMapController', () => {
  let controller: TestCategoryMapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestCategoryMapController],
      providers: [TestCategoryMapService],
    }).compile();

    controller = module.get<TestCategoryMapController>(TestCategoryMapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
