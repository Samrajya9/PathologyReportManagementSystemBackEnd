import { Test, TestingModule } from '@nestjs/testing';
import { TestUnitController } from './test-unit.controller';
import { TestUnitService } from './test-unit.service';

describe('TestUnitController', () => {
  let controller: TestUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestUnitController],
      providers: [TestUnitService],
    }).compile();

    controller = module.get<TestUnitController>(TestUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
