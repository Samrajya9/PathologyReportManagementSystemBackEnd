import { AdminService } from '@modules/admin/admin.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AdminUserEntity } from '@modules/admin/entities/admin.entity';
import { PartnerUserEntity } from '@modules/partner/entities/partner.entity';
import { AppUserEntity } from '@modules/user/entities/user.entity';
import { PartnerService } from '@modules/partner/partner.service';
import { UserService } from '@modules/user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CreateAdminDto } from '@modules/admin/dto/create-admin.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { CreatePartnerDto } from '@modules/partner/dto/create-partner.dto';
import { AppJwtPayload } from '@common/types/jwt.types';
import { UserRole } from '@common/types/user-role.type';
import { AppAuthenticatedUser } from '@common/types/express';
import { ConfigService } from '@nestjs/config';

type AuthUser =
  | (AdminUserEntity & { role: UserRole })
  | (PartnerUserEntity & { role: UserRole })
  | (AppUserEntity & { role: UserRole });

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly partnerService: PartnerService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private bCryptOptions = { saltRounds: 10 };

  async registerAdmin(dto: CreateAdminDto) {
    const doesEmailExist = await this.emailExists(dto.email);
    if (doesEmailExist) {
      throw new BadRequestException(`Email ${dto.email} is already in use`);
    }
    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.bCryptOptions.saltRounds,
    );
    return this.adminService.create({ ...dto, password: hashedPassword });
  }

  async registerUser(dto: CreateUserDto) {
    const doesEmailExist = await this.emailExists(dto.email);
    if (doesEmailExist) {
      throw new BadRequestException(`Email ${dto.email} is already in use`);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.userService.create({ ...dto, password: hashedPassword });
  }

  async registerPartner(dto: CreatePartnerDto) {
    const doesEmailExist = await this.emailExists(dto.email);
    if (doesEmailExist) {
      throw new BadRequestException(`Email ${dto.email} is already in use`);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
  }

  async registerPartnerWithCompany() {}

  async generateAccessToken(user: AppAuthenticatedUser) {
    const payload: AppJwtPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    const accessConfig =
      this.configService.get<JwtSignOptions>('jwtConfig.access');
    const access_token = await this.jwtService.signAsync(payload, accessConfig);

    return { id: user.id, access_token };
  }

  async signIn(user: AppAuthenticatedUser) {
    const payload: AppJwtPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const accessConfig =
      this.configService.get<JwtSignOptions>('jwtConfig.access');
    const refreshConfig =
      this.configService.get<JwtSignOptions>('jwtConfig.refresh');

    const access_token = await this.jwtService.signAsync(payload, accessConfig);
    const refresh_token = await this.jwtService.signAsync(
      payload,
      refreshConfig,
    );
    return { id: user.id, access_token, refresh_token };
  }

  async validateUser(loginDto: LoginDto) {
    const { email, password, role } = loginDto;
    let user: AuthUser | null = null;
    switch (role) {
      case 'admin':
        const a = await this.adminService.findByEmail(email);
        if (!a) throw new UnauthorizedException('');
        user = {
          ...a,
          role: 'admin',
        };
        break;
      case 'partner':
        const p = await this.partnerService.findByEmail(email);
        if (!p) throw new UnauthorizedException('');
        user = {
          ...p,
          role: 'partner',
        };
        break;
      case 'user':
        const u = await this.userService.findByEmail(email);
        if (!u) throw new UnauthorizedException('');
        user = { ...u, role: 'user' };
        break;
      default:
        throw new UnauthorizedException(`Unsupported user type: ${role}`);
    }
    if (!user) {
      throw new UnauthorizedException(`${role} with email ${email} not found`);
    }
    await this.validatePassword(password, user.password);

    const authenicatedUser: AppAuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return authenicatedUser;
  }

  private async emailExists(email: string): Promise<boolean> {
    const results = await Promise.all([
      this.adminService
        .findByEmail(email)
        .then(() => true)
        .catch(() => false),
      this.userService
        .findByEmail(email)
        .then(() => true)
        .catch(() => false),
      this.partnerService
        .findByEmail(email)
        .then(() => true)
        .catch(() => false),
    ]);
    return results.some((exists) => exists === true);
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
