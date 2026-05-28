import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PerfilVacanteService } from './perfil-vacante.service';
import { UpdatePerfilVacanteDto } from './dto/update-perfil-vacante.dto';
import { AddIdiomaPerfilDto } from './dto/add-idioma-perfil.dto';
import { AddConocimientoPerfilDto } from './dto/add-conocimiento-perfil.dto';
import { AddHabilidadPerfilDto } from './dto/add-habilidad-perfil.dto';
import { AddEquipoPerfilDto } from './dto/add-equipo-perfil.dto';
import { AddRasgoPerfilDto } from './dto/add-rasgo-perfil.dto';
import { AddFormacionPerfilDto } from './dto/add-formation-perfil.dto';
import { AddPlanCarreraDto } from './dto/add-plan-carrera.dto';
@Controller('perfil-vacante')
export class PerfilVacanteController {
  constructor(private readonly perfilVacanteService: PerfilVacanteService) {}

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePerfilVacanteDto) {
    console.log('DTO sexo =>', body.sexo); // 👈 agrega esto
    return this.perfilVacanteService.update(Number(id), body);
  }
  @Post(':id/idiomas')
  addIdioma(@Param('id') id: string, @Body() body: AddIdiomaPerfilDto) {
    return this.perfilVacanteService.addIdioma(Number(id), body);
  }

  @Post(':id/conocimientos')
  addConocimiento(
    @Param('id') id: string,
    @Body() body: AddConocimientoPerfilDto,
  ) {
    return this.perfilVacanteService.addConocimiento(Number(id), body);
  }
  @Post(':id/habilidades')
  addHabilidad(@Param('id') id: string, @Body() body: AddHabilidadPerfilDto) {
    return this.perfilVacanteService.addHabilidad(Number(id), body);
  }

  @Post(':id/equipos')
  addEquipo(@Param('id') id: string, @Body() body: AddEquipoPerfilDto) {
    return this.perfilVacanteService.addEquipo(Number(id), body);
  }

  @Post(':id/rasgos')
  addRasgo(@Param('id') id: string, @Body() body: AddRasgoPerfilDto) {
    return this.perfilVacanteService.addRasgo(Number(id), body);
  }

  @Post(':id/formacion')
  addFormacion(@Param('id') id: string, @Body() body: AddFormacionPerfilDto) {
    return this.perfilVacanteService.addFormacion(Number(id), body);
  }

  @Post(':id/plan-carrera')
  addPlanCarrera(@Param('id') id: string, @Body() body: AddPlanCarreraDto) {
    return this.perfilVacanteService.addPlanCarrera(Number(id), body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perfilVacanteService.findOne(Number(id));
  }
}
