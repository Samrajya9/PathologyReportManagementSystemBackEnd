import { Test, TestingModule } from '@nestjs/testing';
import { ResultValueOptionsController } from './result_value_options.controller';
import { ResultValueOptionsService } from './result_value_options.service';

describe('ResultValueOptionsController', () => {
  let controller: ResultValueOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultValueOptionsController],
      providers: [ResultValueOptionsService],
    }).compile();

    controller = module.get<ResultValueOptionsController>(ResultValueOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
