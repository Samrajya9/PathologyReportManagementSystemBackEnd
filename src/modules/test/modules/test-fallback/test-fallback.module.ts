import { forwardRef, Module } from '@nestjs/common';
import { TestFallbackService } from './test-fallback.service';
import { TestFallbackController } from './test-fallback.controller';
import { TestModule } from '@modules/test/test.module';

@Module({
  imports: [forwardRef(() => TestModule)],
  controllers: [TestFallbackController],
  providers: [TestFallbackService],
})
export class TestFallbackModule {}
