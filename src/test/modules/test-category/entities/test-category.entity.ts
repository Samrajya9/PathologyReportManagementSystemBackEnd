import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { TestCategoryMapEntity } from '../../test-category-map/entities/test-category-map.entity';

@Entity({ name: 'test_categories' })
export class TestCategoryEntity extends AppBaseEntity {
  @Column()
  name: string;

  @OneToMany(() => TestCategoryMapEntity, (map) => map.category)
  testMappings: TestCategoryMapEntity[];
}
