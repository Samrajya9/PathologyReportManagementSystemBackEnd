import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TestOrdersService } from './test_orders.service';
import { CreateTestOrderDto } from './dto/create-test_order.dto';
import { UpdateTestOrderDto } from './dto/update-test_order.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Request } from 'express';
import { IsAdminGuard } from '@common/guards/is-admin.guard';

// Only Login user can access these endpoints
// @UseGuards(JwtAuthGuard)
@Controller()
export class TestOrdersController {
  constructor(private readonly testOrdersService: TestOrdersService) {}

  // Only signed in user can create test order
  @Post()
  create(@Body() createTestOrderDto: CreateTestOrderDto, @Req() req: Request) {
    const userID = req.user?.id!;
    return this.testOrdersService.create(createTestOrderDto, userID);
  }

  // Only admin can access all test orders
  // @UseGuards(IsAdminGuard)
  @Get()
  findAll(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    return this.testOrdersService.findAll(pageNumber, limitNumber);
  }

  @UseGuards(IsAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestOrderDto: UpdateTestOrderDto,
  ) {
    return this.testOrdersService.update(+id, updateTestOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testOrdersService.remove(+id);
  }
}
