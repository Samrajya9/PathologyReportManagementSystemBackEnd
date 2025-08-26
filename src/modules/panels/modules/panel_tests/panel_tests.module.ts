import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PanelTestsService } from './panel_tests.service';
import { PanelTestsController } from './panel_tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelTestEntity } from './entities/panel_test.entity';
import { PanelsModule } from '@modules/panels/panels.module';
import { TestModule } from '@modules/test/test.module';

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

// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply()
//       .forRoutes({ path: 'panels/tests*', method: RequestMethod.ALL });
//   }
// }
