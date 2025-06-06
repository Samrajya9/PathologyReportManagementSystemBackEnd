import { Test, TestingModule } from '@nestjs/testing';
import { SpecimensController } from './specimens.controller';
import { SpecimensService } from './specimens.service';

describe('SpecimensController', () => {
  let controller: SpecimensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecimensController],
      providers: [SpecimensService],
    }).compile();

    controller = module.get<SpecimensController>(SpecimensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
