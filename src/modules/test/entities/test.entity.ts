import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/common/entity/BaseEntity';
import { TestUnitEntity } from '../modules/test-unit/entities/tes-unit.entity';
import { MedicalDepartmentEntity } from '@modules/medical_departments/entities/medical_department.entity';
import { ReferenceRangeEntity } from '../modules/reference_ranges/entities/reference_range.entity';
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

  @OneToMany(() => ReferenceRangeEntity, (range) => range.test)
  referenceRanges: ReferenceRangeEntity[];

  @ManyToOne(() => ResultValueTypeEntity, { eager: true })
  resultValueType: ResultValueTypeEntity;

  @OneToMany(() => ResultValueOptionEntity, (rvo) => rvo.test, {
    eager: true,
  })
  resultValueOptions: ResultValueOptionEntity[];
}
