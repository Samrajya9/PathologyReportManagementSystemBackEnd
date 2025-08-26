import { Module } from '@nestjs/common';
import { ResultValueTypesService } from './result_value_types.service';
import { ResultValueTypesController } from './result_value_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultValueTypeEntity } from './entities/result_value_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResultValueTypeEntity])],
  controllers: [ResultValueTypesController],
  providers: [ResultValueTypesService],
  exports: [ResultValueTypesService],
})
export class ResultValueTypesModule {}
