import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerCompanyDto } from './create-partner-company.dto';

export class UpdatePartnerCompanyDto extends PartialType(CreatePartnerCompanyDto) {}
