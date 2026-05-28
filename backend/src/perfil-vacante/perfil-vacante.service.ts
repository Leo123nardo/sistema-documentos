/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdatePerfilVacanteDto } from './dto/update-perfil-vacante.dto';
import { AddIdiomaPerfilDto } from './dto/add-idioma-perfil.dto';
import { AddConocimientoPerfilDto } from './dto/add-conocimiento-perfil.dto';
import { AddHabilidadPerfilDto } from './dto/add-habilidad-perfil.dto';
import { AddEquipoPerfilDto } from './dto/add-equipo-perfil.dto';
import { AddRasgoPerfilDto } from './dto/add-rasgo-perfil.dto';
import { AddFormacionPerfilDto } from './dto/add-formation-perfil.dto';
import { AddPlanCarreraDto } from './dto/add-plan-carrera.dto';
import { Sexo, HorarioLaboral, GradoEstudio } from '@prisma/client';

@Injectable()
export class PerfilVacanteService {
  constructor(private readonly prisma: PrismaService) {}
  async update(perfilId: number, dto: UpdatePerfilVacanteDto) {
    const exists = await this.prisma.perfilVacante.findUnique({
      where: { id: perfilId },
    });

    if (!exists) {
      throw new NotFoundException('Perfil de vacante no encontrado');
    }

    const data = {
      edadMinima: dto.edadMinima,
      edadMaxima: dto.edadMaxima,
      anosExperiencia: dto.anosExperiencia,
      sueldoMin: dto.sueldoMin,
      sueldoMax: dto.sueldoMax,
      nivelPuesto: dto.nivelPuesto,
      generacionVacante: dto.generacionVacante,
      viaje: dto.viaje,
      auto: dto.auto,
      cambioResidencia: dto.cambioResidencia,

      // ✅ MAPEO CORRECTO DE ENUMS
      sexo: dto.sexo ? Sexo[dto.sexo] : undefined,
      horarioLaboral: dto.horarioLaboral
        ? HorarioLaboral[dto.horarioLaboral]
        : undefined,
      gradoEstudio: dto.gradoEstudio
        ? GradoEstudio[dto.gradoEstudio]
        : undefined,
    };

    return this.prisma.perfilVacante.update({
      where: { id: perfilId },
      data,
    });
  }
  addIdioma(perfilId: number, dto: AddIdiomaPerfilDto) {
    return this.prisma.perfilIdioma.create({
      data: {
        perfilId: perfilId,
        idiomaId: dto.idiomaId,
        pctLeido: dto.pctLeido,
        pctHablado: dto.pctHablado,
        pctEscrito: dto.pctEscrito,
      },
    });
  }

  async addConocimiento(perfilId: number, dto: AddConocimientoPerfilDto) {
    const conocimiento = await this.prisma.conocimiento.upsert({
      where: { descripcion: dto.descripcion },
      update: {},
      create: { descripcion: dto.descripcion },
    });

    return this.prisma.perfilConocimiento.create({
      data: {
        perfilId,
        conocimientoId: conocimiento.id,
        tiempoMeses: dto.tiempoMeses,
      },
    });
  }

  addHabilidad(perfilId: number, dto: AddHabilidadPerfilDto) {
    return this.prisma.perfilHabilidadInformatica.create({
      data: {
        perfilId: perfilId,
        habilidadId: dto.habilidadId,
      },
    });
  }

  addEquipo(perfilId: number, dto: AddEquipoPerfilDto) {
    return this.prisma.perfilEquipoMaquinaria.create({
      data: {
        perfilId: perfilId,
        equipoId: dto.equipoId,
      },
    });
  }

  async addRasgo(perfilId: number, dto: AddRasgoPerfilDto) {
    const rasgo = await this.prisma.rasgoPersonalidad.upsert({
      where: { descripcion: dto.descripcion },
      update: {},
      create: { descripcion: dto.descripcion },
    });

    return this.prisma.perfilRasgoPersonalidad.create({
      data: {
        perfilId,
        rasgoId: rasgo.id,
      },
    });
  }

  addFormacion(perfilId: number, dto: AddFormacionPerfilDto) {
    return this.prisma.perfilFormacionAcademica.create({
      data: {
        perfilId: perfilId,
        formacionId: dto.formacionId,
      },
    });
  }

  addPlanCarrera(perfilId: number, dto: AddPlanCarreraDto) {
    return this.prisma.perfilPlanCarrera.create({
      data: {
        perfilId: perfilId,
        puestoId: dto.puestoId,
        orden: dto.orden,
      },
    });
  }

  async findOne(id: number) {
    const perfil = await this.prisma.perfilVacante.findUnique({
      where: { id },
      include: {
        idiomas: { include: { idioma: true } },
        conocimientos: { include: { conocimiento: true } },
        habilidades: { include: { habilidad: true } },
        equipos: { include: { equipo: true } },
        rasgos: { include: { rasgo: true } },
        formaciones: {
          include: {
            formacion: { select: { id: true, nombre: true } },
          },
        },
        planCarrera: {
          include: {
            puesto: true,
          },
          orderBy: { orden: 'asc' },
        },
      },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return perfil;
  }
}
