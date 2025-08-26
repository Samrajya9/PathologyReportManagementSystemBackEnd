import { Injectable } from '@nestjs/common';
import { CreateTestSpecimenContainerDto } from './dto/create-test_specimen_container.dto';
import { UpdateTestSpecimenContainerDto } from './dto/update-test_specimen_container.dto';
import { SpecimenEntity } from '@modules/specimens/entities/specimen.entity';
import { ContainerEntity } from '@modules/container/entities/container.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TestSpecimenContainerEntity } from './entities/test_specimen_container.entity';
import { Repository } from 'typeorm';
import { TestEntity } from '@modules/test/entities/test.entity';

@Injectable()
export class TestSpecimenContainerService {
  constructor(
    @InjectRepository(TestSpecimenContainerEntity)
    private readonly tscRepo: Repository<TestSpecimenContainerEntity>,
  ) {}

  async create(
    createTestSpecimenContainerDto: CreateTestSpecimenContainerDto,
  ) {}

  async createFormObj(
    test: TestEntity,
    specimen: SpecimenEntity,
    container: ContainerEntity,
  ) {
    const entityObj = this.tscRepo.create({ test, specimen, container });
    const newEntity = await this.tscRepo.save(entityObj);
    return newEntity;
  }

  findAll() {
    return `This action returns all testSpecimenContainer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testSpecimenContainer`;
  }

  async findByTestId(testId: number) {
    const result = await this.tscRepo.find({
      where: { test: { id: testId } },
      relations: { specimen: true, container: true },
    });
    return result;
  }

  update(
    id: number,
    updateTestSpecimenContainerDto: UpdateTestSpecimenContainerDto,
  ) {
    return `This action updates a #${id} testSpecimenContainer`;
  }

  remove(id: number) {
    return `This action removes a #${id} testSpecimenContainer`;
  }
}
