import { Module } from '@nestjs/common';
import { PuestosService } from './puestos.service';
import { PuestosController } from './puestos.controller';

@Module({
  providers: [PuestosService],
  controllers: [PuestosController],
})
export class PuestosModule {}
