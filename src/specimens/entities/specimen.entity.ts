import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'specimens' })
export class SpecimenEntity extends AppBaseEntity {
  @Column({ unique: true })
  name: string;
  @Column({ type: 'text' })
  storage: string;
}
