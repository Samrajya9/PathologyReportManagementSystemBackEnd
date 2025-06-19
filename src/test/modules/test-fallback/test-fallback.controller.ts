import {
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TestFallbackService } from './test-fallback.service';
import { TestService } from 'src/test/test.service';

@Controller()
export class TestFallbackController {
  constructor(
    private readonly testFallbackService: TestFallbackService,
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}

  @Get()
  getTestById(@Param('id', ParseIntPipe) id: number) {
    // Add ParseIntPipe
    console.log(id);

    return this.testService.findOne(+id);
  }
}
