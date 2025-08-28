import { AppBaseEntity } from '@common/entity/BaseEntity';
import { PartnerUserEntity } from '@modules/partner/entities/partner.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'partner_companies' })
export class PartnerCompanyEntity extends AppBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(
    () => PartnerUserEntity,
    (partnerUser) => partnerUser.partnerCompany,
  )
  users: PartnerUserEntity[];
}
