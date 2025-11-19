import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderTestDto } from './create-order_test.dto';

export class UpdateOrderTestDto extends PartialType(CreateOrderTestDto) {}
