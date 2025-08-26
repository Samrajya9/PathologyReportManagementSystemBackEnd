import { Module } from '@nestjs/common';
import { ResultValueTypesService } from './result_value_types.service';
import { ResultValueTypesController } from './result_value_types.controller';

@Module({
  controllers: [ResultValueTypesController],
  providers: [ResultValueTypesService],
  exports: [ResultValueTypesService],
})
export class ResultValueTypesModule {}
