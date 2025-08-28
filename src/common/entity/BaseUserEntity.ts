import { Column, Entity, Index } from 'typeorm';
import { AppBaseEntity } from './BaseEntity';

@Entity()
@Index(['email'], { unique: true })
export abstract class AppBaseUserEntity extends AppBaseEntity {
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
}
