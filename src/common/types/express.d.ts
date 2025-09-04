import { UserRole } from '@common/types/user-role.type';

export interface AppAuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface User extends AppAuthenticatedUser {}
  }
}
