import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { TestEntity } from 'src/test/entities/test.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ResultValueOptionEntity extends AppBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  value: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  displayText?: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @ManyToOne(() => TestEntity, (test) => test.resultValueOptions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  test: TestEntity;

  // @Column({  type: 'boolean', default: true })
  // isNormal: boolean;

  // @Column({ type: 'boolean', default: false })
  // isCritical: boolean;
}
