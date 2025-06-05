import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { TestEntity } from 'src/test/entities/test.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  ANY = 'any',
}

@Entity({ name: 'reference_ranges' })
export class ReferenceRangeEntity extends AppBaseEntity {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  age_min_years: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  age_max_years: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.ANY })
  gender: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  normal_min: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  normal_max: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  critical_min: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  critical_max: string;

  @Column({ type: 'text', nullable: true, default: null })
  notes: string;

  @ManyToOne(() => TestEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  test: TestEntity;
}
