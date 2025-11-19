import { Module } from '@nestjs/common';
import { TestResultService } from './test-result.service';
import { TestResultController } from './test-result.controller';

@Module({
  controllers: [TestResultController],
  providers: [TestResultService],
})
export class TestResultModule {}
