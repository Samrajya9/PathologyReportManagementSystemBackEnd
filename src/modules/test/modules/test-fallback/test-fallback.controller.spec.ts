import { Test, TestingModule } from '@nestjs/testing';
import { TestFallbackController } from './test-fallback.controller';
import { TestFallbackService } from './test-fallback.service';

describe('TestFallbackController', () => {
  let controller: TestFallbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestFallbackController],
      providers: [TestFallbackService],
    }).compile();

    controller = module.get<TestFallbackController>(TestFallbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
