import { Injectable, NotFoundException } from '@nestjs/common';
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
    const cotanier = this.containerRepo.create(createContainerDto);
    const newContainer = await this.containerRepo.save(cotanier);
    return newContainer;
  }

  findAll() {
    return `This action returns all container`;
  }

  async findOne(id: number) {
    const container = await this.containerRepo.findOne({ where: { id } });
    if (!container)
      throw new NotFoundException(`Container with Id ${id} not found`);
    return container;
  }

  async findOneWithTransactinally(id: number, transaction: EntityManager) {
    const container = await transaction.findOne(ContainerEntity, {
      where: { id },
    });
    // const container = await this.containerRepo.findOne({ where: { id } });
    if (!container)
      throw new NotFoundException(`Container with Id ${id} not found`);
    return container;
  }
  update(id: number, updateContainerDto: UpdateContainerDto) {
    return `This action updates a #${id} container`;
  }

  remove(id: number) {
    return `This action removes a #${id} container`;
  }
}
