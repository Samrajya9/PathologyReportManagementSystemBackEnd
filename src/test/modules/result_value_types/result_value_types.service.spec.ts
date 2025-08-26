import { Test, TestingModule } from '@nestjs/testing';
import { ResultValueTypesService } from './result_value_types.service';

describe('ResultValueTypesService', () => {
  let service: ResultValueTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultValueTypesService],
    }).compile();

    service = module.get<ResultValueTypesService>(ResultValueTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
