import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContainerEntity } from './entities/container.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContainerEntity])],
  controllers: [ContainerController],
  providers: [ContainerService],
  exports: [ContainerService],
})
export class ContainerModule {}
