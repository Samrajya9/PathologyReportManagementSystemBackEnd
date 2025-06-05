import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReferenceRangesService } from './reference_ranges.service';
import { CreateReferenceRangeDto } from './dto/create-reference_range.dto';
import { UpdateReferenceRangeDto } from './dto/update-reference_range.dto';

@Controller('reference-ranges')
export class ReferenceRangesController {
  constructor(
    private readonly referenceRangesService: ReferenceRangesService,
  ) {}

  @Post()
  create(@Body() createReferenceRangeDto: CreateReferenceRangeDto) {
    return this.referenceRangesService.createByTestId(createReferenceRangeDto);
  }

  @Get()
  findAll() {
    return this.referenceRangesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referenceRangesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReferenceRangeDto: UpdateReferenceRangeDto,
  ) {
    return this.referenceRangesService.update(+id, updateReferenceRangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referenceRangesService.remove(+id);
  }
}
