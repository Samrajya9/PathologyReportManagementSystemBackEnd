import { PartialType } from '@nestjs/mapped-types';
import { CreateResultValueTypeDto } from './create-result_value_type.dto';

export class UpdateResultValueTypeDto extends PartialType(CreateResultValueTypeDto) {}
