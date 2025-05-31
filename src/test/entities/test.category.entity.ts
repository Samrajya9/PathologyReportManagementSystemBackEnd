import { Column, Entity, OneToMany } from 'typeorm';
import { TestCategoryMapEntity } from './test.category.map.entity';
import { GlobalBaseEntity } from 'src/global/entity/BaseEntity';

@Entity({ name: 'test_categories' })
export class TestCategoryEntity extends GlobalBaseEntity {
  @Column()
  name: string;

  @OneToMany(() => TestCategoryMapEntity, (map) => map.category)
  testMappings: TestCategoryMapEntity[];
}
