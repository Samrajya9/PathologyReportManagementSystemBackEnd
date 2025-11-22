import { AppBaseUserEntity } from '@common/entity/BaseUserEntity';
import { GenderEnum } from '@common/enums/gender.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class AppUserEntity extends AppBaseUserEntity {
  // @Column({ nullable: true })
  // fullName: string;
  // @Column({ type: 'date', nullable: true })
  // dateOfBirth: Date;
  // @Column({
  //   type: 'enum',
  //   enum: GenderEnum,
  //   nullable: true,
  // })
  // gender: GenderEnum;
  // @Column({ nullable: true })
  // phone: string;
}
