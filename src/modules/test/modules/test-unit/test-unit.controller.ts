//src/test/modules/test-unit/test-unit.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { TestUnitService } from './test-unit.service';
import { CreateTesUnitDto } from './dto/create-tes-unit.dto';
import { UpdateTesUnitDto } from './dto/update-tes-unit.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { IsAdminGuard } from '@common/guards/is-admin.guard';

// @UseInterceptors(CacheInterceptor)
@Controller()
export class TestUnitController {
  constructor(private readonly testUnitService: TestUnitService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  create(@Body() createTesUnitDto: CreateTesUnitDto) {
    return this.testUnitService.create(createTesUnitDto);
  }

  @Get()
  // @CacheKey('custom_units_key')
  findAll() {
    return this.testUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testUnitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTesUnitDto: UpdateTesUnitDto) {
    return this.testUnitService.update(+id, updateTesUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testUnitService.remove(+id);
  }
}
