import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicalDepartmentsService } from './medical_departments.service';
import { CreateDepartmentDto } from './dto/create-medical_department.dto';
import { UpdateMedicalDepartmentDto } from './dto/update-medical_department.dto';

@Controller()
export class MedicalDepartmentsController {
  constructor(
    private readonly medicalDepartmentsService: MedicalDepartmentsService,
  ) {}

  @Post()
  create(@Body() CreateDepartmentDto: CreateDepartmentDto) {
    return this.medicalDepartmentsService.create(CreateDepartmentDto);
  }

  @Get()
  findAll() {
    return this.medicalDepartmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalDepartmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicalDepartmentDto: UpdateMedicalDepartmentDto,
  ) {
    return this.medicalDepartmentsService.update(
      +id,
      updateMedicalDepartmentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalDepartmentsService.remove(+id);
  }
}
