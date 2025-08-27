import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContainerEntity } from './entities/container.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ContainerService {
  constructor(
    @InjectRepository(ContainerEntity)
    private readonly containerRepo: Repository<ContainerEntity>,
  ) {}
  async create(createContainerDto: CreateContainerDto) {
    const newContainer = this.containerRepo.create(createContainerDto);
    const result = await this.containerRepo.save(newContainer);
    return result;
  }

  async findAll() {
    return this.containerRepo.find();
  }

  async findOne(id: number) {
    const container = await this.containerRepo.findOne({ where: { id } });
    if (!container)
      throw new NotFoundException(`Container with Id ${id} not found`);
    return container;
  }

  async findOneWithTransactionally(id: number, transaction: EntityManager) {
    const container = await transaction.findOne(ContainerEntity, {
      where: { id },
    });
    // const container = await this.containerRepo.findOne({ where: { id } });
    if (!container)
      throw new NotFoundException(`Container with Id ${id} not found`);
    return container;
  }
  async update(id: number, updateContainerDto: UpdateContainerDto) {
    const container = await this.findOne(id);
    const updatedContainer = await this.containerRepo.merge(
      container,
      updateContainerDto,
    );
    return this.containerRepo.save(updatedContainer);
  }

  remove(id: number) {
    return this.containerRepo.delete({ id });
  }
}
