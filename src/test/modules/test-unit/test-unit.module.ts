import { Module } from '@nestjs/common';
import { TestUnitService } from './test-unit.service';
import { TestUnitController } from './test-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUnitEntity } from './entities/tes-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestUnitEntity])],
  controllers: [TestUnitController],
  providers: [TestUnitService],
  exports: [TestUnitService],
})
export class TestUnitModule {}
