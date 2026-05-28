import { Module } from '@nestjs/common';
import { AprobacionesService } from './aprobaciones.service';
import { AprobacionesController } from './aprobaciones.controller';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { RequisicionModule } from '../requisicion/requisicion.module';
@Module({
  controllers: [AprobacionesController],
  providers: [AprobacionesService],
  imports: [NotificacionesModule, RequisicionModule],
})
export class AprobacionesModule {}
