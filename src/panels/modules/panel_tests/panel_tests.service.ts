import { Injectable } from '@nestjs/common';
import { CreatePanelTestDto } from './dto/create-panel_test.dto';
import { UpdatePanelTestDto } from './dto/update-panel_test.dto';

@Injectable()
export class PanelTestsService {
  create(createPanelTestDto: CreatePanelTestDto) {
    return 'This action adds a new panelTest';
  }

  findAll() {
    return `This action returns all panelTests`;
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
