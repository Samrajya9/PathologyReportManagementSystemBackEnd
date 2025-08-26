import { forwardRef, Module } from '@nestjs/common';
import { ResultValueOptionsService } from './result_value_options.service';
import { ResultValueOptionsController } from './result_value_options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultValueOptionEntity } from './entities/result_value_option.entity';
import { TestModule } from '@modules/test/test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResultValueOptionEntity]),
    forwardRef(() => TestModule),
  ],
  controllers: [ResultValueOptionsController],
  providers: [ResultValueOptionsService],
  exports: [ResultValueOptionsService],
})
export class ResultValueOptionsModule {}
