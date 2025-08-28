import { AppBaseUserEntity } from '@common/entity/BaseUserEntity';
import { Entity } from 'typeorm';

@Entity({ name: 'amdin_users' })
export class AdminUserEntity extends AppBaseUserEntity {}
