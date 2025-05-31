import { Module } from '@nestjs/common';
import { TestTypeService } from './test-type.service';
import { TestTypeController } from './test-type.controller';

@Module({
  controllers: [TestTypeController],
  providers: [TestTypeService],
})
export class TestTypeModule {}
