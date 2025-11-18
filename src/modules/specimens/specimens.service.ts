import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecimenDto } from './dto/create-specimen.dto';
import { UpdateSpecimenDto } from './dto/update-specimen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecimenEntity } from './entities/specimen.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';

@Injectable()
export class SpecimensService {
  constructor(
    @InjectRepository(SpecimenEntity)
    private readonly specimenRepo: Repository<SpecimenEntity>,
  ) {}
  private readonly findAllOptions: FindManyOptions<SpecimenEntity> = {
    order: { id: 'desc' },
  };
  private readonly findOneOptions: FindOneOptions<SpecimenEntity> = {
    relations: [],
  };
  async create(createSpecimenDto: CreateSpecimenDto) {
    const newSpecimen = this.specimenRepo.create(createSpecimenDto);
    const result = await this.specimenRepo.save(newSpecimen);
    return result;
  }

  async findAll() {
    return await this.specimenRepo.find(this.findAllOptions);
  }

  async findOne(id: AppBaseEntityIdDataType) {
    const specimen = await this.specimenRepo.findOne({
      where: { id },
      ...this.findOneOptions,
    });
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
