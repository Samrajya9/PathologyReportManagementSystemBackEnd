import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PanelTestsService } from './panel_tests.service';
import { CreatePanelTestDto } from './dto/create-panel_test.dto';
import { UpdatePanelTestDto } from './dto/update-panel_test.dto';

@Controller('panel_tests') // Relative to parent route
export class PanelTestsController {
  constructor(private readonly panelTestsService: PanelTestsService) {}

  @Post()
  create(@Body() createPanelTestDto: CreatePanelTestDto) {
    return this.panelTestsService.create(createPanelTestDto);
  }

  @Get()
  findAll() {
    return this.panelTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.panelTestsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePanelTestDto: UpdatePanelTestDto,
  ) {
    return this.panelTestsService.update(+id, updatePanelTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panelTestsService.remove(+id);
  }
}
