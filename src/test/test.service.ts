import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';
import { TestUnitEntity } from './entities/test.unit.entity';
import { TestTypeEntity } from './entities/test.type.entity';
import { TestCategoryEntity } from './entities/test.category.entity';
import { TestCategoryMapEntity } from './entities/test.category.map.entity';
import { CreateTestUnitDto } from './dto/create-test-unit.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: Repository<TestEntity>,
    @InjectRepository(TestUnitEntity)
    private readonly testUnitRepo: Repository<TestUnitEntity>,
    @InjectRepository(TestTypeEntity)
    private readonly testTypeRepo: Repository<TestTypeEntity>,
    @InjectRepository(TestCategoryEntity)
    private readonly testCategoryRepo: Repository<TestCategoryEntity>,
    @InjectRepository(TestCategoryMapEntity)
    private readonly testCategorymapRepo: Repository<TestCategoryMapEntity>,
  ) {}
  create(createTestDto: CreateTestDto) {
    return 'This action adds a new test';
  }

  findAll() {
    return `This action returns all test`;
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }

  createUnit(createTestUnitDto: CreateTestUnitDto) {
    const newUnit = this.testUnitRepo.create(createTestUnitDto);
    return this.testUnitRepo.save(newUnit);
  }
}
