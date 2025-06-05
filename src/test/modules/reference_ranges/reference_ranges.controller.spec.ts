import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceRangesController } from './reference_ranges.controller';
import { ReferenceRangesService } from './reference_ranges.service';

describe('ReferenceRangesController', () => {
  let controller: ReferenceRangesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceRangesController],
      providers: [ReferenceRangesService],
    }).compile();

    controller = module.get<ReferenceRangesController>(ReferenceRangesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
