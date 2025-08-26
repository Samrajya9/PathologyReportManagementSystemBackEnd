import { PartialType } from '@nestjs/mapped-types';
import { CreateTesUnitDto } from './create-tes-unit.dto';

export class UpdateTesUnitDto extends PartialType(CreateTesUnitDto) {}
