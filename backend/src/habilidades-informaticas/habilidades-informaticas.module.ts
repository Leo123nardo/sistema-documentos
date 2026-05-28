import { Module } from '@nestjs/common';
import { HabilidadesInformaticasService } from './habilidades-informaticas.service';
import { HabilidadesInformaticasController } from './habilidades-informaticas.controller';

@Module({
  providers: [HabilidadesInformaticasService],
  controllers: [HabilidadesInformaticasController]
})
export class HabilidadesInformaticasModule {}
