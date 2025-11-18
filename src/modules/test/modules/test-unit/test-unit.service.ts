import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTesUnitDto } from './dto/create-tes-unit.dto';
import { UpdateTesUnitDto } from './dto/update-tes-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestUnitEntity } from './entities/tes-unit.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';

@Injectable()
export class TestUnitService {
  constructor(
    @InjectRepository(TestUnitEntity)
    private readonly testUnitRepo: Repository<TestUnitEntity>,
  ) {}

  private readonly findAllOptions: FindManyOptions<TestUnitEntity> = {
    order: { id: 'desc' },
  };

  private readonly findOneOptions: FindManyOptions<TestUnitEntity> = {
    relations: [],
  };
  async create(createTesUnitDto: CreateTesUnitDto) {
    const newTestUnit = this.testUnitRepo.create(createTesUnitDto);
    const result = await this.testUnitRepo.save(newTestUnit);
    return result;
  }

  findAll() {
    return this.testUnitRepo.find(this.findAllOptions);
  }

  async findOne(id: number) {
    const testUnit = await this.testUnitRepo.findOne({
      where: { id },
      ...this.findOneOptions,
    });
    if (!testUnit) {
      throw new NotFoundException('Test unit not found');
    }
    return testUnit;
  }

  async update(
    id: AppBaseEntityIdDataType,
    updateTesUnitDto: UpdateTesUnitDto,
  ) {
    const testUnit = await this.findOne(id);

    const updatedUnit = this.testUnitRepo.merge(testUnit, updateTesUnitDto);
    return this.testUnitRepo.save(updatedUnit);
  }

  remove(id: AppBaseEntityIdDataType) {
    return this.testUnitRepo.delete({ id });
  }
}
