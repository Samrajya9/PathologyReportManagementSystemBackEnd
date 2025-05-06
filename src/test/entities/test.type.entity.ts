import { GlobalBaseEntity } from 'src/global/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'test_types' })
export class TestTypeEntity extends GlobalBaseEntity {
  @Column()
  name: string;
}
