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

  private bCryptOptions = { saltRounds: 10 };

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
    // If any of them returned true, the email exists
    return results.some((exists) => exists === true);
  }

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
    // const company = await this.partnerService.findCompanyById(dto.partnerCompanyId);
    // if (!company) throw new NotFoundException('Partner company not found');
    // const hashedPassword = await bcrypt.hash(dto.password, 10);
    // return this.partnerService.create({
    //   ...dto,
    //   password: hashedPassword,
    //   partnerCompany: company,
    // });
  }

  async registerPartnerWithCompany() {}

  async signIn(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload: AppJwtPayload = {
      sub: user.id,
      role: user.role,
    };
    const access_token = await this.signToken(payload);
    return { id: user.id, access_token };
  }

  async validateUser(loginDto: LoginDto) {
    const { email, password, role } = loginDto;
    let user: AuthUser | null = null;
    switch (role) {
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
        throw new UnauthorizedException(`Unsupported user type: ${role}`);
    }
    if (!user) {
      throw new UnauthorizedException(`${role} with email ${email} not found`);
    }
    await this.validatePassword(password, user.password);
    return user;
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
