import { AppBaseUserEntity } from '@common/entity/BaseUserEntity';
import { Entity } from 'typeorm';

@Entity({ name: 'admin_users' })
export class AdminUserEntity extends AppBaseUserEntity {}
