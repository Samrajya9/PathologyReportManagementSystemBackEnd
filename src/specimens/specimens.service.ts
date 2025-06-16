import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecimenDto } from './dto/create-specimen.dto';
import { UpdateSpecimenDto } from './dto/update-specimen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecimenEntity } from './entities/specimen.entity';
import { Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';

@Injectable()
export class SpecimensService {
  constructor(
    @InjectRepository(SpecimenEntity)
    private readonly specimenRepo: Repository<SpecimenEntity>,
  ) {}

  async create(createSpecimenDto: CreateSpecimenDto) {
    const specimen = this.specimenRepo.create(createSpecimenDto);
    const newSpecimen = await this.specimenRepo.save(specimen);
    return newSpecimen;
  }

  async findAll() {
    return await this.specimenRepo.find();
  }

  async findOne(id: AppBaseEntityIdDataType) {
    const specimen = await this.specimenRepo.findOne({ where: { id } });
    if (!specimen)
      throw new NotFoundException(`Specimen with id ${id} not found`);
    return specimen;
  }

  async update(
    id: AppBaseEntityIdDataType,
    updateSpecimenDto: UpdateSpecimenDto,
  ) {
    const specimen = await this.findOne(id);
    const updateSpecimen = this.specimenRepo.merge(specimen, updateSpecimenDto);
    return await this.specimenRepo.save(updateSpecimen);
  }

  async remove(id: number) {
    return await this.specimenRepo.delete({ id });
  }
}
