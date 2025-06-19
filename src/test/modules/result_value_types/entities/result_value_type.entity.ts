import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ResultValueTypeEntity extends AppBaseEntity {
  @Column()
  name: string; // Numeric’, ‘Text’, ‘Categorical’, or ‘Semi-Quantitative
}
