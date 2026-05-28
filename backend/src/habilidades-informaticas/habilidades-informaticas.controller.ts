import { Body, Controller, Get, Post } from '@nestjs/common';
import { HabilidadesInformaticasService } from './habilidades-informaticas.service';

@Controller('habilidades-informaticas')
export class HabilidadesInformaticasController {
  constructor(
    private readonly habilidadesService: HabilidadesInformaticasService,
  ) {}

  @Get()
  findAll() {
    return this.habilidadesService.findAll();
  }

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.habilidadesService.create(nombre);
  }
}
