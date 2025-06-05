import { PartialType } from '@nestjs/mapped-types';
import { CreateReferenceRangeDto } from './create-reference_range.dto';

export class UpdateReferenceRangeDto extends PartialType(CreateReferenceRangeDto) {}
