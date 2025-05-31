import { Module } from '@nestjs/common';
import { TestUnitService } from './test-unit.service';
import { TestUnitController } from './test-unit.controller';

@Module({
  controllers: [TestUnitController],
  providers: [TestUnitService],
})
export class TestUnitModule {}
