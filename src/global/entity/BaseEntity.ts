import { Entity, PrimaryGeneratedColumn } from 'typeorm';

export type GlobalIdDataType = number;

@Entity()
export class GlobalBaseEntity {
  @PrimaryGeneratedColumn()
  id: GlobalIdDataType;
}
