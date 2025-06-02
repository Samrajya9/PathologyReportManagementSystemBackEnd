import { Test, TestingModule } from '@nestjs/testing';
import { PanelsService } from './panels.service';

describe('PanelsService', () => {
  let service: PanelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelsService],
    }).compile();

    service = module.get<PanelsService>(PanelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
