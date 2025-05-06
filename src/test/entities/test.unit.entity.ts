import { GlobalBaseEntity } from 'src/global/entity/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'test_units' })
export class TestUnitEntity extends GlobalBaseEntity {
  @Column()
  name: string;
}
