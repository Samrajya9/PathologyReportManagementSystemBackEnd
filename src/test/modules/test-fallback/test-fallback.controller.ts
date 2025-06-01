import { Controller, forwardRef, Get, Inject, Param } from '@nestjs/common';
import { TestFallbackService } from './test-fallback.service';
import { TestService } from 'src/test/test.service';

@Controller('')
export class TestFallbackController {
  constructor(
    private readonly testFallbackService: TestFallbackService,
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}

  @Get(':id')
  getTestById(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }
}
