import { Test, TestingModule } from '@nestjs/testing';
import { ResultValueOptionsService } from './result_value_options.service';

describe('ResultValueOptionsService', () => {
  let service: ResultValueOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultValueOptionsService],
    }).compile();

    service = module.get<ResultValueOptionsService>(ResultValueOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
