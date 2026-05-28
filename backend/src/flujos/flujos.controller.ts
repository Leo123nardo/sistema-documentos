import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { FlujosService } from './flujos.service';

@Controller('flujos')
export class FlujosController {
  constructor(private readonly flujosService: FlujosService) {}

  @Post()
  create(@Body('nombre') nombre: string, @Body('version') version: string) {
    return this.flujosService.create(nombre, version);
  }

  @Post(':id/pasos')
  addPaso(
    @Param('id') id: string,
    @Body('orden') orden: number,
    @Body('titulo') titulo: string,
  ) {
    return this.flujosService.addPaso(Number(id), orden, titulo);
  }

  @Get()
  findAll() {
    return this.flujosService.findAll();
  }
}
