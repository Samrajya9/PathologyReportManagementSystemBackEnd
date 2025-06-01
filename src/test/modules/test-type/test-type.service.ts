import { Injectable } from '@nestjs/common';
import { CreateTestTypeDto } from './dto/create-test-type.dto';
import { UpdateTestTypeDto } from './dto/update-test-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestTypeEntity } from './entities/test-type.entity';
import { Repository } from 'typeorm';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';

@Injectable()
export class TestTypeService {
  constructor(
    @InjectRepository(TestTypeEntity)
    private readonly testTypeRepo: Repository<TestTypeEntity>,
  ) {}

  async create(createTestTypeDto: CreateTestTypeDto) {
    const newTestType = this.testTypeRepo.create(createTestTypeDto);
    const result = await this.testTypeRepo.save(newTestType);
    return result;
  }

  async findAll() {
    return await this.testTypeRepo.find();
  }

  async findOne(id: AppBaseEntityIdDataType) {
    const testType = await this.testTypeRepo.findOne({
      where: { id },
    });
    if (!testType) {
      throw new Error('Test type not found');
    }
    return testType;
  }

  async update(
    id: AppBaseEntityIdDataType,
    updateTestTypeDto: UpdateTestTypeDto,
  ) {
    const testType = await this.findOne(id);
    const updatedTestType = this.testTypeRepo.merge(
      testType,
      updateTestTypeDto,
    );
    return this.testTypeRepo.save(updatedTestType);
  }

  remove(id: AppBaseEntityIdDataType) {
    return this.testTypeRepo.delete({ id });
  }
}
