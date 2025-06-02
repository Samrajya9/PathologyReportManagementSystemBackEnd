import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PanelEntity } from './entities/panel.entity';
import { Repository } from 'typeorm';
import { MedicalDepartmentsService } from 'src/medical_departments/medical_departments.service';

@Injectable()
export class PanelsService {
  constructor(
    @InjectRepository(PanelEntity)
    private readonly panelRepo: Repository<PanelEntity>,
    private readonly medicalDepartmentService: MedicalDepartmentsService,
  ) {}
  async create(createPanelDto: CreatePanelDto) {
    const { medicalDepartmentId, price, ...data } = createPanelDto;
    const department =
      await this.medicalDepartmentService.findOne(medicalDepartmentId);
    const newPanel = this.panelRepo.create({
      ...data,
      price: parseFloat(price).toFixed(2).toString(),
      medicalDepartment: department,
    });
    return await this.panelRepo.save(newPanel);
  }

  async findAll() {
    return await this.panelRepo.find();
  }

  async findOne(id: number) {
    const panel = await this.panelRepo.findOne({ where: { id } });
    if (!panel) {
      throw new NotFoundException(`Panel with ID ${id} not found`);
    }
    return panel;
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
