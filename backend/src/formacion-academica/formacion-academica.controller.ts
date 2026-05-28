import { Body, Controller, Get, Post } from '@nestjs/common';
import { FormacionAcademicaService } from './formacion-academica.service';

@Controller('formacion-academica')
export class FormacionAcademicaController {
  constructor(private readonly formacionService: FormacionAcademicaService) {}

  @Get()
  findAll() {
    return this.formacionService.findAll();
  }

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.formacionService.create(nombre);
  }
}
