import { GlobalBaseEntity } from 'src/global/entity/BaseEntity';
import { Entity, ManyToOne } from 'typeorm';
import { TestEntity } from './test.entity';
import { TestCategoryEntity } from './test.category.entity';

@Entity({ name: 'test_category_map' })
export class TestCategoryMapEntity extends GlobalBaseEntity {
  @ManyToOne(() => TestEntity, (test) => test.categoryMappings, {
    onDelete: 'CASCADE',
  })
  test: TestEntity;

  @ManyToOne(() => TestCategoryEntity, (category) => category.testMappings, {
    onDelete: 'CASCADE',
  })
  category: TestCategoryEntity;
}
