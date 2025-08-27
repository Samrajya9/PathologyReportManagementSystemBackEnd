import { TestEntity } from '@modules/test/entities/test.entity';
import { AppBaseEntity } from '@common/entity/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  ANY = 'any',
}

@Entity({ name: 'reference_ranges' })
export class ReferenceRangeEntity extends AppBaseEntity {
  @ManyToOne(() => TestEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  test: TestEntity;

  // Demographics
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  age_min_years: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  age_max_years: string;

  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.ANY })
  gender: GenderEnum;

  // Range values
  @Column({ type: 'decimal', precision: 15, scale: 6 })
  normal_min: string;

  @Column({ type: 'decimal', precision: 15, scale: 6 })
  normal_max: string;

  @Column({ type: 'decimal', precision: 15, scale: 6 })
  critical_min: string;

  @Column({ type: 'decimal', precision: 15, scale: 6 })
  critical_max: string;

  @Column({ type: 'text', nullable: true, default: null })
  notes: string;
}
