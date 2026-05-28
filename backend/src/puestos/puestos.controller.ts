import { Body, Controller, Get, Post } from '@nestjs/common';
import { PuestosService } from './puestos.service';

@Controller('puestos')
export class PuestosController {
  constructor(private readonly puestosService: PuestosService) {}

  @Get()
  findAll() {
    return this.puestosService.findAll();
  }

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.puestosService.create(nombre);
  }
}
