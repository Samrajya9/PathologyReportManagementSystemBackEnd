import { AdminService } from '@modules/admin/admin.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AdminUserEntity } from '@modules/admin/entities/admin.entity';
import { PartnerUserEntity } from '@modules/partner/entities/partner.entity';
import { AppUserEntity } from '@modules/user/entities/user.entity';
import { PartnerService } from '@modules/partner/partner.service';
import { UserService } from '@modules/user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

type AuthUser =
  | (AdminUserEntity & { role: 'admin' })
  | (PartnerUserEntity & { role: 'partner' })
  | (AppUserEntity & { role: 'user' });

interface AppJwtPayloadBase {
  sub: string | number;
  role: 'admin' | 'partner' | 'user';
}

type AppJwtPayload<T extends object = {}> = AppJwtPayloadBase & T;

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly partnerService: PartnerService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password, userType } = loginDto;
    let user: AuthUser | null = null;

    switch (userType) {
      case 'admin':
        user = {
          ...(await this.adminService.findByEmail(email)),
          role: 'admin',
        };
        break;
      case 'partner':
        user = {
          ...(await this.partnerService.findByEmail(email)),
          role: 'partner',
        };
        break;
      case 'user':
        user = { ...(await this.userService.findByEmail(email)), role: 'user' };
        break;

      default:
        throw new UnauthorizedException(`Unsupported user type: ${userType}`);
    }
    if (!user) {
      throw new UnauthorizedException(
        `${userType} with email ${email} not found`,
      );
    }
    await this.validatePassword(password, user.password);
    const { password: _, ...result } = user;

    const payload: AppJwtPayload = {
      sub: user.id,
      role: user.role,
    };
    const access_token = await this.signToken(payload);

    return { id: user.id, access_token };
  }

  private signToken(payload: AppJwtPayload, options?: JwtSignOptions) {
    return this.jwtService.signAsync(payload, options);
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ) {
    const isValidPassword = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
