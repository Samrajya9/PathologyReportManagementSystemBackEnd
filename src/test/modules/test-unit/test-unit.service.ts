import { Injectable } from '@nestjs/common';
import { CreateTesUnitDto } from './dto/create-tes-unit.dto';
import { UpdateTesUnitDto } from './dto/update-tes-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestUnitEntity } from './entities/tes-unit.entity';
import { Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';

@Injectable()
export class TestUnitService {
  constructor(
    @InjectRepository(TestUnitEntity)
    private readonly testUnitRepo: Repository<TestUnitEntity>,
  ) {}
  create(createTesUnitDto: CreateTesUnitDto) {
    const newTestUnit = this.testUnitRepo.create(createTesUnitDto);
    return this.testUnitRepo.save(newTestUnit);
  }

  findAll() {
    return this.testUnitRepo.find();
  }

  async findOne(id: number) {
    const testUnit = await this.testUnitRepo.findOne({
      where: { id },
    });
    if (!testUnit) {
      throw new Error('Test unit not found');
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
