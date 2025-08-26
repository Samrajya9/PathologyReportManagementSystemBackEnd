import {
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TestFallbackService } from './test-fallback.service';
import { TestService } from '@modules/test/test.service';

@Controller()
export class TestFallbackController {
  constructor(
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}

  @Get()
  getTestById(@Param('id', ParseIntPipe) id: number) {
    // Add ParseIntPipe
    return this.testService.findOne(+id);
  }
}
