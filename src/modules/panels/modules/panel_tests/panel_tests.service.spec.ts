import { Test, TestingModule } from '@nestjs/testing';
import { PanelTestsService } from './panel_tests.service';

describe('PanelTestsService', () => {
  let service: PanelTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelTestsService],
    }).compile();

    service = module.get<PanelTestsService>(PanelTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
