import { Test, TestingModule } from '@nestjs/testing';
import { TestTypeService } from './test-type.service';

describe('TestTypeService', () => {
  let service: TestTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestTypeService],
    }).compile();

    service = module.get<TestTypeService>(TestTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
