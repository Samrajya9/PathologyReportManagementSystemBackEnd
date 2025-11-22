import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RoleValidationPipe implements PipeTransform {
  private readonly allowedRoles = ['admin', 'partner', 'user'] as const;

  transform(value: any) {
    if (!this.allowedRoles.includes(value as any)) {
      throw new BadRequestException('Invalid role parameter');
    }
    return value as (typeof this.allowedRoles)[number]; // Narrow type
  }
}
