import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultValueTypeDto } from './dto/create-result_value_type.dto';
import { UpdateResultValueTypeDto } from './dto/update-result_value_type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultValueTypeEntity } from './entities/result_value_type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResultValueTypesService {
  constructor(
    @InjectRepository(ResultValueTypeEntity)
    private readonly resultValueTypeRepo: Repository<ResultValueTypeEntity>,
  ) {}
  async create(createResultValueTypeDto: CreateResultValueTypeDto) {
    const entry = this.resultValueTypeRepo.create(createResultValueTypeDto);
    const newEntry = await this.resultValueTypeRepo.save(entry);
    return newEntry;
  }

  findAll() {
    return this.resultValueTypeRepo.find();
  }

  async findOne(id: number) {
    const obj = await this.resultValueTypeRepo.findOne({ where: { id } });
    if (!obj)
      throw new NotFoundException(`Result Value Type with id ${id} not found`);
    return obj;
  }

  async update(id: number, updateResultValueTypeDto: UpdateResultValueTypeDto) {
    const entry = await this.findOne(id);
    const update = this.resultValueTypeRepo.merge(
      entry,
      updateResultValueTypeDto,
    );
    return await this.resultValueTypeRepo.save(update);
  }

  async remove(id: number) {
    return await this.resultValueTypeRepo.delete({ id });
  }
}
