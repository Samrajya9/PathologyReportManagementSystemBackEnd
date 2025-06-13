import { PartialType } from '@nestjs/mapped-types';
import { CreateResultValueOptionDto } from './create-result_value_option.dto';

export class UpdateResultValueOptionDto extends PartialType(CreateResultValueOptionDto) {}
