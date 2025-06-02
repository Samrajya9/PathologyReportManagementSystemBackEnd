import { Test, TestingModule } from '@nestjs/testing';
import { PanelTestsController } from './panel_tests.controller';
import { PanelTestsService } from './panel_tests.service';

describe('PanelTestsController', () => {
  let controller: PanelTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelTestsController],
      providers: [PanelTestsService],
    }).compile();

    controller = module.get<PanelTestsController>(PanelTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
