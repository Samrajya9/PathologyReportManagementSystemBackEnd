import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecimensService } from './specimens.service';
import { CreateSpecimenDto } from './dto/create-specimen.dto';
import { UpdateSpecimenDto } from './dto/update-specimen.dto';

@Controller('specimens')
export class SpecimensController {
  constructor(private readonly specimensService: SpecimensService) {}

  @Post()
  create(@Body() createSpecimenDto: CreateSpecimenDto) {
    return this.specimensService.create(createSpecimenDto);
  }

  @Get()
  findAll() {
    return this.specimensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specimensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecimenDto: UpdateSpecimenDto) {
    return this.specimensService.update(+id, updateSpecimenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specimensService.remove(+id);
  }
}
