import { forwardRef, Module } from '@nestjs/common';
import { PanelTestsService } from './panel_tests.service';
import { PanelTestsController } from './panel_tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelTestEntity } from './entities/panel_test.entity';
import { PanelsModule } from 'src/panels/panels.module';
import { TestModule } from 'src/test/test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PanelTestEntity]),
    forwardRef(() => PanelsModule),
    TestModule,
  ],
  controllers: [PanelTestsController],
  providers: [PanelTestsService],
  exports: [PanelTestsService],
})
export class PanelTestsModule {}
