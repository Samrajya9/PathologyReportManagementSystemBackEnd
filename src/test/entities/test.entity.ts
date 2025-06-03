import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { TestUnitEntity } from '../modules/test-unit/entities/tes-unit.entity';
import { TestCategoryMapEntity } from '../modules/test-category-map/entities/test-category-map.entity';
import { MedicalDepartmentEntity } from 'src/medical_departments/entities/medical_department.entity';

@Entity({ name: 'tests' })
export class TestEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: string;

  @Column({ type: 'decimal', name: 'normal_range_min', nullable: true })
  normalRangeMin: string;
  @Column({ type: 'decimal', name: 'normal_range_max', nullable: true })
  normalRangeMax: string;

  @ManyToOne(() => TestUnitEntity, { eager: true })
  testUnit: TestUnitEntity;

  @ManyToOne(() => MedicalDepartmentEntity, { eager: true })
  medicalDepartment: MedicalDepartmentEntity;

  @OneToMany(() => TestCategoryMapEntity, (map) => map.test)
  categoryMappings: TestCategoryMapEntity[];
}
