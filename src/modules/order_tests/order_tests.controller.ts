import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderTestsService } from './order_tests.service';
import { CreateOrderTestDto } from './dto/create-order_test.dto';
import { UpdateOrderTestDto } from './dto/update-order_test.dto';

@Controller('order-tests')
export class OrderTestsController {
  constructor(private readonly orderTestsService: OrderTestsService) {}

  @Post()
  create(@Body() createOrderTestDto: CreateOrderTestDto) {
    return this.orderTestsService.create(createOrderTestDto);
  }

  @Get()
  findAll() {
    return this.orderTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderTestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderTestDto: UpdateOrderTestDto) {
    return this.orderTestsService.update(+id, updateOrderTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderTestsService.remove(+id);
  }
}
