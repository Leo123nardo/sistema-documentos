import { Module } from '@nestjs/common';
import { EquiposMaquinariaService } from './equipos-maquinaria.service';
import { EquiposMaquinariaController } from './equipos-maquinaria.controller';

@Module({
  providers: [EquiposMaquinariaService],
  controllers: [EquiposMaquinariaController]
})
export class EquiposMaquinariaModule {}
