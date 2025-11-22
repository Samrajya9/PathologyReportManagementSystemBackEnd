import { Module } from '@nestjs/common';
import { TestRequestsService } from './test-requests.service';
import { TestRequestsController } from './test-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestResultEntity } from './entities/test-result.entity';
import { TestRequestEntity } from './entities/test-request.entity';
import { RequestedTestEntity } from './entities/requested-test.entity';
import { PatientModule } from '@modules/patient/patient.module';

@Module({
  imports: [
    PatientModule,
    TypeOrmModule.forFeature([
      RequestedTestEntity,
      TestRequestEntity,
      TestResultEntity,
    ]),
  ],
  controllers: [TestRequestsController],
  providers: [TestRequestsService],
})
export class TestRequestsModule {}
