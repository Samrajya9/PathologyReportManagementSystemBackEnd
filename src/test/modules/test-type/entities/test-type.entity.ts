import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'test_types' })
export class TestTypeEntity extends AppBaseEntity {
  @Column()
  name: string;
}
