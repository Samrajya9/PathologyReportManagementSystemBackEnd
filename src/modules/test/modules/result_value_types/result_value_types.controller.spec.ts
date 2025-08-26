import { Test, TestingModule } from '@nestjs/testing';
import { ResultValueTypesController } from './result_value_types.controller';
import { ResultValueTypesService } from './result_value_types.service';

describe('ResultValueTypesController', () => {
  let controller: ResultValueTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultValueTypesController],
      providers: [ResultValueTypesService],
    }).compile();

    controller = module.get<ResultValueTypesController>(ResultValueTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
