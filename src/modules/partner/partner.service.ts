import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerUserEntity } from './entities/partner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(PartnerUserEntity)
    private readonly partnerRepo: Repository<PartnerUserEntity>,
  ) {}
  create(createPartnerDto: CreatePartnerDto) {
    return 'This action adds a new partner';
  }

  findAll() {
    return `This action returns all partner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} partner`;
  }

  update(id: number, updatePartnerDto: UpdatePartnerDto) {
    return `This action updates a #${id} partner`;
  }

  remove(id: number) {
    return `This action removes a #${id} partner`;
  }

  async findByEmail(email: string) {
    const partner = await this.partnerRepo.findOne({ where: { email } });
    if (!partner) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return partner;
  }
}
