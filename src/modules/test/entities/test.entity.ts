import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '@common/entity/BaseEntity';
import { TestUnitEntity } from '../modules/test-unit/entities/tes-unit.entity';
import { MedicalDepartmentEntity } from '@modules/medical_departments/entities/medical_department.entity';
import { ReferenceRangeEntity } from '../modules/reference_ranges/entities/reference_range.entity';
import { ResultValueOptionEntity } from '../modules/result_value_options/entities/result_value_option.entity';
import { ResultValueTypeEnum } from '@common/enums/result-value-type.enum';

@Entity({ name: 'tests' })
export class TestEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: string;

  //   @Column({
  //   type: 'decimal',
  //   precision: 10,
  //   scale: 2,
  //   transformer: {
  //     to: (value: number) => value, // save as number
  //     from: (value: string): number => parseFloat(value), // read as number
  //   },
  // })
  // price: number;

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

  @OneToMany(() => ReferenceRangeEntity, (range) => range.test, { eager: true })
  referenceRanges: ReferenceRangeEntity[];

  @OneToMany(() => ResultValueOptionEntity, (rvo) => rvo.test, {
    eager: true,
  })
  resultValueOptions: ResultValueOptionEntity[];
}
