import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FuncionesPrincipalesService } from './funciones-principales.service';
import { CreateFuncionPrincipalDto } from './dto/create-funcion-principal.dto';

@Controller('requisiciones/:id/funciones')
export class FuncionesPrincipalesController {
  constructor(private readonly funcionesService: FuncionesPrincipalesService) {}

  @Post()
  addFuncion(@Param('id') id: string, @Body() body: CreateFuncionPrincipalDto) {
    return this.funcionesService.addFuncion(Number(id), body);
  }

  @Get()
  findAll(@Param('id') id: string) {
    return this.funcionesService.findByRequisicion(Number(id));
  }
}
