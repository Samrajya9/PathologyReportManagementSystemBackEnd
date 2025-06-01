import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { TestUnitEntity } from '../modules/test-unit/entities/tes-unit.entity';
import { TestTypeEntity } from '../modules/test-type/entities/test-type.entity';
import { TestCategoryMapEntity } from '../modules/test-category-map/entities/test-category-map.entity';

@Entity({ name: 'tests' })
export class TestEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'decimal', name: 'normal_range_min', nullable: true })
  normalRangeMin: string;
  @Column({ type: 'decimal', name: 'normal_range_max', nullable: true })
  normalRangeMax: string;

  @ManyToOne(() => TestUnitEntity)
  testUnit: TestUnitEntity;

  @ManyToOne(() => TestTypeEntity)
  testType: TestTypeEntity;

  @OneToMany(() => TestCategoryMapEntity, (map) => map.test)
  categoryMappings: TestCategoryMapEntity[];
}
