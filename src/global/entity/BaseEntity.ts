import { Entity, PrimaryGeneratedColumn } from 'typeorm';

export type GlobalEntityIdDataType = number;

@Entity()
export class GlobalBaseEntity {
  @PrimaryGeneratedColumn()
  id: GlobalEntityIdDataType;
}
