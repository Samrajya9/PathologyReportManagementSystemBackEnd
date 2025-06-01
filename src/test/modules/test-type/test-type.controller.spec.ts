import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeController } from './test-type.controller';
import { TestTypeService } from './test-type.service';

describe('TestTypeController', () => {
  let controller: TestTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestTypeController],
      providers: [TestTypeService],
    }).compile();

    controller = module.get<TestTypeController>(TestTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
