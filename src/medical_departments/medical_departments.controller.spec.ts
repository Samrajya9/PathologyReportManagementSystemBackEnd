import { Test, TestingModule } from '@nestjs/testing';
import { MedicalDepartmentsController } from './medical_departments.controller';
import { MedicalDepartmentsService } from './medical_departments.service';

describe('MedicalDepartmentsController', () => {
  let controller: MedicalDepartmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalDepartmentsController],
      providers: [MedicalDepartmentsService],
    }).compile();

    controller = module.get<MedicalDepartmentsController>(MedicalDepartmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
