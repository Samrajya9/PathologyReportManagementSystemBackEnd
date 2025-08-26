import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceRangesService } from './reference_ranges.service';

describe('ReferenceRangesService', () => {
  let service: ReferenceRangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceRangesService],
    }).compile();

    service = module.get<ReferenceRangesService>(ReferenceRangesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
