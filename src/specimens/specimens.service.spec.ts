import { Test, TestingModule } from '@nestjs/testing';
import { SpecimensService } from './specimens.service';

describe('SpecimensService', () => {
  let service: SpecimensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecimensService],
    }).compile();

    service = module.get<SpecimensService>(SpecimensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
