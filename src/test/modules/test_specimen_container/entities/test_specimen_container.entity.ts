import { ContainerEntity } from 'src/container/entities/container.entity';
import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { SpecimenEntity } from 'src/specimens/entities/specimen.entity';
import { TestEntity } from 'src/test/entities/test.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'testSpecimenContainer' })
export class TestSpecimenContainerEntity extends AppBaseEntity {
  @ManyToOne(() => TestEntity)
  test: TestEntity;

  @ManyToOne(() => SpecimenEntity)
  specimen: SpecimenEntity;

  @ManyToOne(() => ContainerEntity)
  container: ContainerEntity;
}
