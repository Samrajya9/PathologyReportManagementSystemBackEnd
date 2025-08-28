import { CreateBaseUserDto } from '@common/dto/create-baseUser.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePartnerDto extends CreateBaseUserDto {
  @IsNumber()
  @IsNotEmpty()
  partnerCompanyId: number;
}
