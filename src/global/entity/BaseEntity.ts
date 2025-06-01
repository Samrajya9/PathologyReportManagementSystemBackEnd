import { Entity, PrimaryGeneratedColumn } from 'typeorm';

export type AppBaseEntityIdDataType = number;

@Entity()
export class AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: AppBaseEntityIdDataType;
}
