import { TestService } from '@modules/test/test.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TestFallbackService {
  constructor(
    @Inject(forwardRef(() => TestService))
    private readonly testService: TestService,
  ) {}
}
