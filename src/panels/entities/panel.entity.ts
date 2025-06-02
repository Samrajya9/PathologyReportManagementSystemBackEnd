import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { MedicalDepartmentEntity } from 'src/medical_departments/entities/medical_department.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'panels' })
export class PanelEntity extends AppBaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column()
  turnaround_time_hours: number;

  @Column({ default: false })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => MedicalDepartmentEntity, { eager: true })
  medicalDepartment: MedicalDepartmentEntity;
}
