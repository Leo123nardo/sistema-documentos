import { Body, Controller, Get, Post } from '@nestjs/common';
import { RasgosPersonalidadService } from './rasgos-personalidad.service';

@Controller('rasgos-personalidad')
export class RasgosPersonalidadController {
  constructor(private readonly rasgosService: RasgosPersonalidadService) {}

  @Get()
  findAll() {
    return this.rasgosService.findAll();
  }

  @Post()
  create(@Body('descripcion') descripcion: string) {
    return this.rasgosService.create(descripcion);
  }
}
