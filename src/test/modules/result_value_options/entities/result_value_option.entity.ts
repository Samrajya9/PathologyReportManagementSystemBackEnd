import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { TestEntity } from 'src/test/entities/test.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ResultValueOptionEntity extends AppBaseEntity {
  @Column()
  value: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @ManyToOne(() => TestEntity, (test) => test.resultValueOptions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  test: TestEntity;
}
