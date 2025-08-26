import { forwardRef, Module } from '@nestjs/common';
import { ReferenceRangesService } from './reference_ranges.service';
import { ReferenceRangesController } from './reference_ranges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenceRangeEntity } from './entities/reference_range.entity';
import { TestModule } from 'src/test/test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferenceRangeEntity]),
    forwardRef(() => TestModule),
  ],
  controllers: [ReferenceRangesController],
  providers: [ReferenceRangesService],
  exports: [ReferenceRangesService],
})
export class ReferenceRangesModule {}
