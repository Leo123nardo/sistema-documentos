import { Module } from '@nestjs/common';
import { ConocimientosService } from './conocimientos.service';
import { ConocimientosController } from './conocimientos.controller';

@Module({
  providers: [ConocimientosService],
  controllers: [ConocimientosController],
})
export class ConocimientosModule {}
