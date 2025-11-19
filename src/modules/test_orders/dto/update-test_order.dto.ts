import { PartialType } from '@nestjs/mapped-types';
import { CreateTestOrderDto } from './create-test_order.dto';

export class UpdateTestOrderDto extends PartialType(CreateTestOrderDto) {}
