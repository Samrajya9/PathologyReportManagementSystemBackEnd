import { Test, TestingModule } from '@nestjs/testing';
import { TestRequestsController } from './test-requests.controller';
import { TestRequestsService } from './test-requests.service';

describe('TestRequestsController', () => {
  let controller: TestRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestRequestsController],
      providers: [TestRequestsService],
    }).compile();

    controller = module.get<TestRequestsController>(TestRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
