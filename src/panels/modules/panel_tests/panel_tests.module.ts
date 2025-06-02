import { Module } from '@nestjs/common';
import { PanelTestsService } from './panel_tests.service';
import { PanelTestsController } from './panel_tests.controller';

@Module({
  controllers: [PanelTestsController],
  providers: [PanelTestsService],
})
export class PanelTestsModule {}
