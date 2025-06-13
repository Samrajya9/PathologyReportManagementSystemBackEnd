import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { TestUnitEntity } from '../modules/test-unit/entities/tes-unit.entity';
import { TestCategoryMapEntity } from '../modules/test-category-map/entities/test-category-map.entity';
import { MedicalDepartmentEntity } from 'src/medical_departments/entities/medical_department.entity';
import { ReferenceRangeEntity } from '../modules/reference_ranges/entities/reference_range.entity';
import { SpecimenEntity } from 'src/specimens/entities/specimen.entity';
import { ResultValueOptionEntity } from '../modules/result_value_options/entities/result_value_option.entity';
import { ResultValueTypeEntity } from '../modules/result_value_types/entities/result_value_type.entity';

@Entity({ name: 'tests' })
export class TestEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: string;

  @ManyToOne(() => TestUnitEntity, { eager: true })
  testUnit: TestUnitEntity;

  @ManyToOne(() => MedicalDepartmentEntity, { eager: true })
  medicalDepartment: MedicalDepartmentEntity;

  @ManyToOne(() => SpecimenEntity, { eager: true })
  specimens: SpecimenEntity;

  @ManyToOne(() => ResultValueTypeEntity, { eager: true })
  resultValueType: ResultValueTypeEntity;

  @OneToMany(() => ReferenceRangeEntity, (range) => range.test)
  referenceRanges: ReferenceRangeEntity[];

  @OneToMany(() => TestCategoryMapEntity, (map) => map.test)
  categoryMappings: TestCategoryMapEntity[];

  @OneToMany(() => ResultValueOptionEntity, (rvo) => rvo.test, {
    eager: true,
  })
  resultValueOptions: ResultValueOptionEntity[];
}
