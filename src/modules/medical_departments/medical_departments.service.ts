import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-medical_department.dto';
import { UpdateMedicalDepartmentDto } from './dto/update-medical_department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalDepartmentEntity } from './entities/medical_department.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';

@Injectable()
export class MedicalDepartmentsService {
  constructor(
    @InjectRepository(MedicalDepartmentEntity)
    private readonly medicalDepRepo: Repository<MedicalDepartmentEntity>,
  ) {}

  private readonly findAllOptions: FindManyOptions<MedicalDepartmentEntity> = {
    order: { id: 'desc' },
  };

  private readonly findOneOptions: FindOneOptions<MedicalDepartmentEntity> = {
    relations: [],
  };

  async create(createDepartDto: CreateDepartmentDto) {
    const newDepartment = this.medicalDepRepo.create(createDepartDto);
    const result = await this.medicalDepRepo.save(newDepartment);
    return result;
  }

  async findAll() {
    return await this.medicalDepRepo.find(this.findAllOptions);
  }

  async findOne(id: AppBaseEntityIdDataType) {
    const medicalDep = await this.medicalDepRepo.findOne({
      where: { id },
      ...this.findOneOptions,
    });
    if (!medicalDep) {
      throw new NotFoundException('Medical Department not found');
    }
    return medicalDep;
  }

  async update(
    id: AppBaseEntityIdDataType,
    updateDepartDto: UpdateMedicalDepartmentDto,
  ) {
    const medicalDep = await this.findOne(id);
    const updatedMedicalDep = this.medicalDepRepo.merge(
      medicalDep,
      updateDepartDto,
    );
    return this.medicalDepRepo.save(updatedMedicalDep);
  }

  remove(id: AppBaseEntityIdDataType) {
    return this.medicalDepRepo.delete({ id });
  }
}
