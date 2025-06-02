import { PartialType } from '@nestjs/mapped-types';
import { CreatePanelTestDto } from './create-panel_test.dto';

export class UpdatePanelTestDto extends PartialType(CreatePanelTestDto) {}
