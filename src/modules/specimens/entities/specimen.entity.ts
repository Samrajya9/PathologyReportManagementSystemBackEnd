import { AppBaseEntity } from '@common/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'specimens' })
export class SpecimenEntity extends AppBaseEntity {
  @Column({ unique: true })
  name: string;
}
