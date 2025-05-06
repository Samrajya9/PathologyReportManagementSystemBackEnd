import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './entities/test.entity';
import { TestUnitEntity } from './entities/test.unit.entity';
import { TestTypeEntity } from './entities/test.type.entity';
import { TestCategoryEntity } from './entities/test.category.entity';
import { TestCategoryMapEntity } from './entities/test.category.map.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestEntity,
      TestUnitEntity,
      TestTypeEntity,
      TestCategoryEntity,
      TestCategoryMapEntity,
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
