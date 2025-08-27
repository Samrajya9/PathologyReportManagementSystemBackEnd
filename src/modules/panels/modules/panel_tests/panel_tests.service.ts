import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreatePanelTestDto } from './dto/create-panel_test.dto';
import { UpdatePanelTestDto } from './dto/update-panel_test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PanelTestEntity } from './entities/panel_test.entity';
import { Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
import { TestService } from '@modules/test/test.service';
import { PanelsService } from '@modules/panels/panels.service';

@Injectable()
export class PanelTestsService {
  constructor(
    @InjectRepository(PanelTestEntity)
    private readonly panelTestRepo: Repository<PanelTestEntity>,
    private readonly testService: TestService,
    @Inject(forwardRef(() => PanelsService))
    private readonly panelsService: PanelsService,
  ) {}
  async create(createPanelTestDto: CreatePanelTestDto) {
    const { panelId, testId, ...data } = createPanelTestDto;
    const panel = await this.panelsService.findOne(panelId);
    const test = await this.testService.findOne(testId);
    const newPanelTest = this.panelTestRepo.create({ ...data, panel, test });
    const panelTest = await this.panelTestRepo.save(newPanelTest);
    return panelTest;
  }
  findAll() {
    return `This action returns all panelTests`;
  }

  async findAllTestByPanelId(panelId: AppBaseEntityIdDataType) {
    const panelTests = await this.panelTestRepo.find({
      where: { panel: { id: panelId } },
      relations: ['test'],
    });

    const tests = await Promise.all(
      panelTests.map((panel) => this.testService.findOne(panel.test.id)),
    );

    return tests;
  }

  findOne(id: number) {
    return `This action returns a #${id} panelTest`;
  }

  update(id: number, updatePanelTestDto: UpdatePanelTestDto) {
    return `This action updates a #${id} panelTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} panelTest`;
  }
}
