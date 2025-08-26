import { Module } from '@nestjs/common';
import { SpecimensService } from './specimens.service';
import { SpecimensController } from './specimens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecimenEntity } from './entities/specimen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecimenEntity])],
  controllers: [SpecimensController],
  providers: [SpecimensService],
  exports: [SpecimensService],
})
export class SpecimensModule {}
