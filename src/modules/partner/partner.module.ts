import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerUserEntity } from './entities/partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerUserEntity])],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
