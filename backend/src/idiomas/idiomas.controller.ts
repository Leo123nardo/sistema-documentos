import { Body, Controller, Get, Post } from '@nestjs/common';
import { IdiomasService } from './idiomas.service';

@Controller('idiomas')
export class IdiomasController {
  constructor(private readonly idiomasService: IdiomasService) {}

  @Get()
  findAll() {
    return this.idiomasService.findAll();
  }

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.idiomasService.create(nombre);
  }
}
