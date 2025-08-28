import { AppBaseUserEntity } from '@common/entity/BaseUserEntity';
import { Entity } from 'typeorm';

@Entity({ name: 'users' })
export class AppUserEntity extends AppBaseUserEntity {}
