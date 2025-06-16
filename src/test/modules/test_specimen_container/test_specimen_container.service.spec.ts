import { Test, TestingModule } from '@nestjs/testing';
import { TestSpecimenContainerService } from './test_specimen_container.service';

describe('TestSpecimenContainerService', () => {
  let service: TestSpecimenContainerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestSpecimenContainerService],
    }).compile();

    service = module.get<TestSpecimenContainerService>(TestSpecimenContainerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
