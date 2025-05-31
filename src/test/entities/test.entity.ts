import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TestUnitEntity } from './test.unit.entity';
import { TestTypeEntity } from './test.type.entity';
import { TestCategoryMapEntity } from './test.category.map.entity';
import { GlobalBaseEntity } from 'src/global/entity/BaseEntity';

@Entity({ name: 'tests' })
export class TestEntity extends GlobalBaseEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => TestUnitEntity)
  @JoinColumn({ name: 'test_unit_id' })
  testUnit: TestUnitEntity;

  @ManyToOne(() => TestTypeEntity)
  @JoinColumn({ name: 'test_type_id' })
  testType: TestTypeEntity;

  @OneToMany(() => TestCategoryMapEntity, (map) => map.test)
  categoryMappings: TestCategoryMapEntity[];

  @Column({ name: 'normal_range_min', nullable: true })
  normalRangeMin: number;
  @Column({ name: 'normal_range_max', nullable: true })
  normalRangeMax: number;
}
