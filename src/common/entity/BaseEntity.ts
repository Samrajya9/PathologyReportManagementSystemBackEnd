import {
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AppBaseEntityIdDataType = number;

@Entity()
@Index(['id'], { unique: true })
export abstract class AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: AppBaseEntityIdDataType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
