import { Test, TestingModule } from '@nestjs/testing';
import { TestSpecimenContainerController } from './test_specimen_container.controller';
import { TestSpecimenContainerService } from './test_specimen_container.service';

describe('TestSpecimenContainerController', () => {
  let controller: TestSpecimenContainerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestSpecimenContainerController],
      providers: [TestSpecimenContainerService],
    }).compile();

    controller = module.get<TestSpecimenContainerController>(TestSpecimenContainerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
