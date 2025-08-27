import { AppBaseEntity } from '@common/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'departments' })
export class MedicalDepartmentEntity extends AppBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
