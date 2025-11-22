import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IsUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;
    if (user?.role !== 'user') {
      throw new ForbiddenException(
        'Access denied. Only Logged In user can access this path',
      );
    }
    return true;
  }
}
