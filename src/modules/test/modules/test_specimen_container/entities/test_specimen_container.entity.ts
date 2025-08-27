import { ContainerEntity } from '@modules/container/entities/container.entity';
import { AppBaseEntity } from '@common/entity/BaseEntity';
import { SpecimenEntity } from '@modules/specimens/entities/specimen.entity';
import { Entity, ManyToOne } from 'typeorm';
import { TestEntity } from '@modules/test/entities/test.entity';

@Entity({ name: 'testSpecimenContainer' })
export class TestSpecimenContainerEntity extends AppBaseEntity {
  @ManyToOne(() => TestEntity)
  test: TestEntity;

  @ManyToOne(() => SpecimenEntity)
  specimen: SpecimenEntity;

  @ManyToOne(() => ContainerEntity)
  container: ContainerEntity;
}
