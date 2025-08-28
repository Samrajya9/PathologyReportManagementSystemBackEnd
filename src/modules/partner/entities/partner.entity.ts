import { AppBaseUserEntity } from '@common/entity/BaseUserEntity';
import { PartnerCompanyEntity } from '@modules/partner-company/entities/partner-company.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'partner_users' })
export class PartnerUserEntity extends AppBaseUserEntity {
  @ManyToOne(() => PartnerCompanyEntity, (company) => company.users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  partnerCompany: PartnerCompanyEntity;
}
