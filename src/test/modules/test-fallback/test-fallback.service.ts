import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TestService } from 'src/test/test.service';

@Injectable()
export class TestFallbackService {
  constructor(
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}
}
