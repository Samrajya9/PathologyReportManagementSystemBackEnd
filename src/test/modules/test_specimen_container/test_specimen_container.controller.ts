import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestSpecimenContainerService } from './test_specimen_container.service';
import { CreateTestSpecimenContainerDto } from './dto/create-test_specimen_container.dto';
import { UpdateTestSpecimenContainerDto } from './dto/update-test_specimen_container.dto';

@Controller('test-specimen-container')
export class TestSpecimenContainerController {
  constructor(private readonly testSpecimenContainerService: TestSpecimenContainerService) {}

  @Post()
  create(@Body() createTestSpecimenContainerDto: CreateTestSpecimenContainerDto) {
    return this.testSpecimenContainerService.create(createTestSpecimenContainerDto);
  }

  @Get()
  findAll() {
    return this.testSpecimenContainerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testSpecimenContainerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestSpecimenContainerDto: UpdateTestSpecimenContainerDto) {
    return this.testSpecimenContainerService.update(+id, updateTestSpecimenContainerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testSpecimenContainerService.remove(+id);
  }
}
