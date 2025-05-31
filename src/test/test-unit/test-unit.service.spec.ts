import { Test, TestingModule } from '@nestjs/testing';
import { TestUnitService } from './test-unit.service';

describe('TestUnitService', () => {
  let service: TestUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestUnitService],
    }).compile();

    service = module.get<TestUnitService>(TestUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
