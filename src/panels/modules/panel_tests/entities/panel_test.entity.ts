import { AppBaseEntity } from 'src/global/entity/BaseEntity';
import { PanelEntity } from 'src/panels/entities/panel.entity';
import { TestEntity } from 'src/test/entities/test.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'panel_tests' })
export class PanelTestEntity extends AppBaseEntity {
  @ManyToOne(() => PanelEntity)
  panel: PanelEntity;
  @Column({ type: 'boolean', default: false })
  is_optional: boolean;
  @ManyToOne(() => TestEntity)
  test: TestEntity;
}
