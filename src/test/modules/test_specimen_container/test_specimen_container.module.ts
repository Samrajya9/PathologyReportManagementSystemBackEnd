import { Module } from '@nestjs/common';
import { TestSpecimenContainerService } from './test_specimen_container.service';
import { TestSpecimenContainerController } from './test_specimen_container.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSpecimenContainerEntity } from './entities/test_specimen_container.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestSpecimenContainerEntity])],
  controllers: [TestSpecimenContainerController],
  providers: [TestSpecimenContainerService],
  exports: [TestSpecimenContainerService],
})
export class TestSpecimenContainerModule {}
