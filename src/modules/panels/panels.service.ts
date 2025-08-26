import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PanelEntity } from './entities/panel.entity';
import { Repository } from 'typeorm';
import { MedicalDepartmentsService } from '@modules/medical_departments/medical_departments.service';
import { PanelTestsService } from './modules/panel_tests/panel_tests.service';

@Injectable()
export class PanelsService {
  constructor(
    @InjectRepository(PanelEntity)
    private readonly panelRepo: Repository<PanelEntity>,
    private readonly medicalDepartmentService: MedicalDepartmentsService,
    @Inject(forwardRef(() => PanelTestsService))
    private readonly panelTesstService: PanelTestsService,
  ) {}

  async create(createPanelDto: CreatePanelDto) {
    const { medicalDepartmentId, testId, price, ...data } = createPanelDto;
    const department =
      await this.medicalDepartmentService.findOne(medicalDepartmentId);
    const newPanel = this.panelRepo.create({
      ...data,
      price: parseFloat(price).toFixed(2).toString(),
      medicalDepartment: department,
    });
    const panel = await this.panelRepo.save(newPanel);
    await Promise.all(
      testId.map((id) =>
        this.panelTesstService.create({ panelId: panel.id, testId: id }),
      ),
    );
    const panelTests = await this.panelTesstService.findAllTestByPanelId(
      panel.id,
    );
    return { ...panel, tests: panelTests };
  }

  async findAll() {
    return await this.panelRepo.find();
  }

  async findOne(id: number) {
    const panel = await this.panelRepo.findOne({ where: { id } });
    if (!panel) {
      throw new NotFoundException(`Panel with ID ${id} not found`);
    }
    const tests = await this.panelTesstService.findAllTestByPanelId(panel.id);
    return { ...panel, tests };
  }

  async update(id: number, updatePanelDto: UpdatePanelDto) {
    const panel = await this.findOne(id);
    const updatedPanel = this.panelRepo.merge(panel, {
      ...updatePanelDto,
      price: updatePanelDto.price
        ? parseFloat(updatePanelDto.price).toFixed(2).toString()
        : panel.price,
    });
    return await this.panelRepo.save(updatedPanel);
  }

  async remove(id: number) {
    return this.panelRepo.delete({ id });
  }
}
