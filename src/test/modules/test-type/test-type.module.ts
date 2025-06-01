import { Module } from '@nestjs/common';
import { TestTypeService } from './test-type.service';
import { TestTypeController } from './test-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTypeEntity } from './entities/test-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestTypeEntity])],
  controllers: [TestTypeController],
  providers: [TestTypeService],
  exports: [TestTypeService],
})
export class TestTypeModule {}
