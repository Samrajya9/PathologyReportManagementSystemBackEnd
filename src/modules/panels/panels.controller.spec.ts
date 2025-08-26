import { Test, TestingModule } from '@nestjs/testing';
import { PanelsController } from './panels.controller';
import { PanelsService } from './panels.service';

describe('PanelsController', () => {
  let controller: PanelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelsController],
      providers: [PanelsService],
    }).compile();

    controller = module.get<PanelsController>(PanelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
