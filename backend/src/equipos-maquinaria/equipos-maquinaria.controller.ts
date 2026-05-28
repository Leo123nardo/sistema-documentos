import { Body, Controller, Get, Post } from '@nestjs/common';
import { EquiposMaquinariaService } from './equipos-maquinaria.service';

@Controller('equipos-maquinaria')
export class EquiposMaquinariaController {
  constructor(private readonly equiposService: EquiposMaquinariaService) {}

  @Get()
  findAll() {
    return this.equiposService.findAll();
  }

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.equiposService.create(nombre);
  }
}
