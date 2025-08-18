import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ResultValueTypeEntity extends AppBaseEntity {
  @Column()
  name: string; // Numeric’, ‘Text’, ‘Categorical’, or ‘Semi-Quantitative
}

// @Entity()
// export class ResultValueOption extends AppBaseEntity {
//   @ManyToOne(() => Test, (test) => test.resultValueOptions, {
//     onDelete: 'CASCADE',
//     nullable: false,
//   })
//   test: Test;

//   @Column({ type: 'varchar', length: 255 })
//   value: string;

//   @Column({
//     name: 'display_text',
//     type: 'varchar',
//     length: 255,
//     nullable: true,
//   })
//   displayText?: string;

//   @Column({ name: 'is_default', type: 'boolean', default: false })
//   isDefault: boolean;

//   @Column({ name: 'is_normal', type: 'boolean', default: true })
//   isNormal: boolean;

//   @Column({ name: 'is_critical', type: 'boolean', default: false })
//   isCritical: boolean;

//   @Column({ name: 'sort_order', type: 'integer', default: 0 })
//   sortOrder: number;
// }
