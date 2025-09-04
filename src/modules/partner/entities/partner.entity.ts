import { AppBaseUserEntity } from '@common/entity/BaseUserEntity';
import { PartnerCompanyEntity } from '@modules/partner-company/entities/partner-company.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity({ name: 'partner_users' })
export class PartnerUserEntity extends AppBaseUserEntity {
  @OneToMany(() => PartnerCompanyEntity, (company) => company.owner)
  companies: PartnerCompanyEntity[];
}
