import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConocimientosService } from './conocimientos.service';

@Controller('conocimientos')
export class ConocimientosController {
  constructor(private readonly conocimientosService: ConocimientosService) {}

  @Get()
  findAll() {
    return this.conocimientosService.findAll();
  }

  @Post()
  create(@Body('descripcion') descripcion: string) {
    return this.conocimientosService.create(descripcion);
  }
}
