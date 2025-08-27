import { PanelEntity } from '@modules/panels/entities/panel.entity';
import { TestEntity } from '@modules/test/entities/test.entity';
import { AppBaseEntity } from '@common/entity/BaseEntity';

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
