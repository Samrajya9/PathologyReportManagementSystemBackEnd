import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/common/entity/BaseEntity';
import { TestUnitEntity } from '../modules/test-unit/entities/tes-unit.entity';
import { MedicalDepartmentEntity } from '@modules/medical_departments/entities/medical_department.entity';
import { ReferenceRangeEntity } from '../modules/reference_ranges/entities/reference_range.entity';
import { ResultValueOptionEntity } from '../modules/result_value_options/entities/result_value_option.entity';

export enum ResultValueTypeEnum {
  NUMERIC = 1,
  TEXT = 2,
  CATEGORICAL = 3,
}

@Entity({ name: 'tests' })
export class TestEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: string;

  @Column({
    type: 'enum',
    enum: ResultValueTypeEnum,
    default: ResultValueTypeEnum.NUMERIC,
  })
  resultValueType: ResultValueTypeEnum;

  @ManyToOne(() => TestUnitEntity, { eager: true })
  testUnit: TestUnitEntity;

  @ManyToOne(() => MedicalDepartmentEntity, { eager: true })
  medicalDepartment: MedicalDepartmentEntity;

  @OneToMany(() => ReferenceRangeEntity, (range) => range.test)
  referenceRanges: ReferenceRangeEntity[];

  // @ManyToOne(() => ResultValueTypeEntity, { eager: true })
  // resultValueType: ResultValueTypeEntity;

  @OneToMany(() => ResultValueOptionEntity, (rvo) => rvo.test, {
    eager: true,
  })
  resultValueOptions: ResultValueOptionEntity[];
}
