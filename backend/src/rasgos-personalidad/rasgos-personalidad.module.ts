import { Module } from '@nestjs/common';
import { RasgosPersonalidadService } from './rasgos-personalidad.service';
import { RasgosPersonalidadController } from './rasgos-personalidad.controller';

@Module({
  providers: [RasgosPersonalidadService],
  controllers: [RasgosPersonalidadController]
})
export class RasgosPersonalidadModule {}
