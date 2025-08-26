import { AppBaseEntity } from 'src/common/entity/BaseEntity';
import { Entity, Index, ManyToOne } from 'typeorm';
import { TestCategoryEntity } from '../../test-category/entities/test-category.entity';
import { TestEntity } from '@modules/test/entities/test.entity';

// Remove in Main
@Entity({ name: 'test_category_map' })
export class TestCategoryMapEntity extends AppBaseEntity {
  @Index()
  @ManyToOne(() => TestEntity, (test) => test.categoryMappings, {
    onDelete: 'CASCADE',
  })
  test: TestEntity;

  @Index()
  @ManyToOne(() => TestCategoryEntity, (category) => category.testMappings, {
    onDelete: 'CASCADE',
  })
  category: TestCategoryEntity;
}
