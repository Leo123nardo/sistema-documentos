import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
//import { Requisicion } from '@prisma/client';
import { CreateRequisicionDto } from './create-requisicion.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
@Injectable()
export class RequisicionService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.requisicion.findMany({
      include: {
        departamento: true,
        flujo: true,
        funcionPrincipals: {
          orderBy: { orden: 'asc' },
        },
        perfil: {
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
        },
      },
    });
  }

  async findOne(id: number) {
    const requisicion = await this.prisma.requisicion.findUnique({
      where: { id },
      include: {
        departamento: true,
        flujo: true,
        funcionPrincipals: {
          orderBy: { orden: 'asc' },
        },
        perfil: {
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
        },
      },
    });

    if (!requisicion) {
      throw new NotFoundException('Requisición no encontrada');
    }

    return requisicion;
  }

  async firmarRequisicion(requisicionId: number, usuarioId: number) {
    const requisicion = await this.prisma.requisicion.findUnique({
      where: { id: requisicionId },
    });

    if (!requisicion) {
      throw new NotFoundException('Requisición no encontrada');
    }

    if (requisicion.firmadoPorId && requisicion.firmadoPorId !== usuarioId) {
      throw new BadRequestException(
        'Esta requisición ya fue firmada por otro usuario',
      );
    }

    if (requisicion.estado !== 'BORRADOR') {
      return {
        yaFirmada: true,
        mensaje: 'La requisición ya fue firmada y se encuentra en autorización',
        requisicionId,
      };
    }

    await this.prisma.requisicion.update({
      where: { id: requisicionId },
      data: {
        firmadoPorId: usuarioId,
        firmadoEn: new Date(),
        estado: 'EN_REVISION',
      },
    });

    const flujo = await this.prisma.flujo.findFirst({
      where: { nombre: 'Flujo Requisición Estándar' },
      include: { pasos: true },
    });

    if (!flujo) {
      throw new Error('Flujo Requisición Estándar no configurado');
    }

    const requisicionFlujo = await this.prisma.requisicionFlujo.create({
      data: {
        requisicionId,
        flujoId: flujo.id,
        estado: 'EN_REVISION',
      },
    });

    for (const paso of flujo.pasos) {
      await this.prisma.aprobacion.create({
        data: {
          requisicionFlujoId: requisicionFlujo.id,
          flujoPasoId: paso.id,
          estado: 'PENDIENTE',
        },
      });
    }

    return {
      mensaje: 'Requisición firmada y enviada a autorización',
      requisicionId,
    };
  }

  async create(data: CreateRequisicionDto) {
    const ultima = await this.prisma.requisicion.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    const siguienteId = (ultima?.id ?? 0) + 1;
    const folio = `REQ-${siguienteId.toString().padStart(4, '0')}`;

    return this.prisma.requisicion.create({
      data: {
        folio,
        fechaSolicitud: new Date(),
        departamentoId: data.departamentoId,
        nombreJefe: data.nombreJefe ?? null,
        personalCargo: data.personalCargo ?? null,
        puestoSolicitado: data.puestoSolicitado ?? null,
        proyectoPlanta: data.proyectoPlanta ?? null,
        cantidadRequerida: data.cantidadRequerida,

        firmadoPorId: null,
        firmadoEn: null,

        estado: 'BORRADOR',

        perfil: {
          create: {},
        },
      },
      include: {
        perfil: true,
      },
    });
  }

  async finalizar(requisicionId: number) {
    const requisicion = await this.prisma.requisicion.findUnique({
      where: { id: requisicionId },
    });

    if (!requisicion) {
      throw new NotFoundException('La requisición no existe');
    }

    await this.prisma.requisicion.update({
      where: { id: requisicionId },
      data: { estado: 'EN_REVISION' },
    });

    await this.assignFlujo(requisicionId, 1);

    return {
      mensaje: 'Requisición finalizada y enviada a revisión',
    };
  }

  async assignFlujo(requisicionId: number, flujoId: number) {
    const requisicion = await this.prisma.requisicion.findUnique({
      where: { id: requisicionId },
    });

    if (!requisicion) {
      throw new NotFoundException('La requisición no existe');
    }

    const flujo = await this.prisma.flujo.findUnique({
      where: { id: flujoId },
    });

    if (!flujo) {
      throw new NotFoundException('El flujo no existe');
    }

    const existente = await this.prisma.requisicionFlujo.findUnique({
      where: { requisicionId },
    });

    if (existente) {
      throw new BadRequestException(
        'La requisición ya tiene un flujo asignado',
      );
    }

    const requisicionFlujo = await this.prisma.requisicionFlujo.create({
      data: {
        estado: 'EN_REVISION',
        requisicion: {
          connect: { id: requisicionId },
        },
        flujo: {
          connect: { id: flujo.id },
        },
      },
    });

    const pasos = await this.prisma.flujoPaso.findMany({
      where: { flujoId },
      orderBy: { orden: 'asc' },
    });

    const aprobacionesExistentes = await this.prisma.aprobacion.findMany({
      where: { requisicionFlujoId: requisicionFlujo.id },
    });

    if (aprobacionesExistentes.length === 0) {
      await this.prisma.aprobacion.createMany({
        data: pasos.map((paso) => ({
          requisicionFlujoId: requisicionFlujo.id,
          flujoPasoId: paso.id,
          comentario: null,
        })),
      });
    }

    return requisicionFlujo;
  }

  //Obtener estado actual del flujo de una requisición
  async getEstadoFlujo(requisicionId: number) {
    const rf = await this.prisma.requisicionFlujo.findUnique({
      where: { requisicionId },
      include: {
        flujo: {
          include: {
            pasos: {
              orderBy: { orden: 'asc' },
            },
          },
        },
        aprobaciones: {
          include: {
            paso: true,
            aprobador: {
              select: {
                id: true,
                nombre: true,
                email: true,
              },
            },
          },
          orderBy: {
            firmadoEn: 'asc',
          },
        },
      },
    });

    if (!rf) {
      return {
        estado: 'SIN_FLUJO',
        mensaje: 'La requisición no tiene flujo asignado',
      };
    }

    const pasosAprobadosIds = rf.aprobaciones.map((a) => a.flujoPasoId);

    const siguientePaso = rf.flujo.pasos.find(
      (p) => !pasosAprobadosIds.includes(p.id),
    );

    return {
      requisicionId,
      flujo: {
        id: rf.flujo.id,
        nombre: rf.flujo.nombre,
        version: rf.flujo.version,
      },
      estado: rf.estado,
      pasos: rf.flujo.pasos.map((paso) => {
        const aprobacion = rf.aprobaciones.find(
          (a) => a.flujoPasoId === paso.id,
        );

        return {
          id: paso.id,
          orden: paso.orden,
          titulo: paso.titulo,
          obligatorio: paso.obligatorio,
          aprobado: Boolean(aprobacion),
          aprobadoPor: aprobacion
            ? {
                id: aprobacion.aprobador?.id,
                nombre: aprobacion.aprobador?.nombre,
                email: aprobacion.aprobador?.email,
              }
            : null,
          aprobadoEn: aprobacion?.firmadoEn ?? null,
          comentario: aprobacion?.comentario ?? null,
        };
      }),
      siguientePaso: siguientePaso
        ? {
            id: siguientePaso.id,
            orden: siguientePaso.orden,
            titulo: siguientePaso.titulo,
          }
        : null,
    };
  }

  //Paso 1 Obtener autorizaciones (pasos del flujo + estado) de una requisición
  async obtenerAutorizaciones(requisicionId: number) {
    const rf = await this.prisma.requisicionFlujo.findUnique({
      where: { requisicionId },
    });

    if (!rf) {
      throw new NotFoundException('La requisición no tiene flujo asignado');
    }

    const aprobaciones = await this.prisma.aprobacion.findMany({
      where: {
        requisicionFlujoId: rf.id,
      },
      include: {
        paso: {
          include: {
            rol: true,
          },
        },
        aprobador: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: {
        paso: { orden: 'asc' },
      },
    });

    const pasoActivo = aprobaciones.find((a) => a.estado === 'PENDIENTE');

    const pasos = aprobaciones.map((a) => {
      const esActivo = pasoActivo?.id == a.id;
      return {
        id: a.id,
        orden: a.paso.orden,
        titulo: a.paso.titulo,
        rol: a.paso.rol?.nombre ?? null,
        estado: a.estado, // PENDIENTE | APROBADA | RECHAZADA
        puedeFirmar: esActivo,
        firmadoEn: a.firmadoEn,
        comentario: a.comentario,
        firmadoPor: a.aprobador?.nombre ?? null,
      };
    });

    return {
      requisicionId,
      flujoId: rf.id,
      pasoActivoOrden: pasoActivo?.paso.orden ?? null,
      pasos,
    };
  }

  async obtenerPendientes(usuarioId: number) {
    const aprobaciones = await this.prisma.aprobacion.findMany({
      where: {
        estado: 'PENDIENTE',
      },
      include: {
        paso: {
          include: {
            rol: true,
          },
        },
        requisicionFlujo: {
          include: {
            requisicion: true,
          },
        },
      },
      orderBy: {
        paso: { orden: 'asc' },
      },
    });

    const rolesUsuario = await this.prisma.usuarioRol.findMany({
      where: { usuarioId },
      include: { rol: true },
    });

    const roles = rolesUsuario.map((r) => r.rol.nombre);

    const pendientes = aprobaciones
      .filter((a) => {
        const rolPaso = a.paso.rol?.nombre;
        return rolPaso && roles.includes(rolPaso);
      })
      .map((a) => ({
        aprobacionId: a.id,
        requisicionId: a.requisicionFlujo.requisicion.id,
        folio: a.requisicionFlujo.requisicion.folio,
        puesto: a.requisicionFlujo.requisicion.puestoSolicitado,
        paso: a.paso.titulo,
        rol: a.paso.rol?.nombre,
      }));

    return pendientes;
  }

  async aprobar(aprobacionId: number, usuarioId: number) {
    const aprobacion = await this.prisma.aprobacion.findUnique({
      where: { id: aprobacionId },
    });

    if (!aprobacion) {
      throw new NotFoundException('Aprobación no encontrada');
    }

    await this.prisma.aprobacion.update({
      where: { id: aprobacionId },
      data: {
        estado: 'APROBADO',
        aprobadorId: usuarioId,
        firmadoEn: new Date(),
      },
    });

    const pendientes = await this.prisma.aprobacion.findMany({
      where: {
        requisicionFlujoId: aprobacion.requisicionFlujoId,
        estado: 'PENDIENTE',
      },
    });

    if (pendientes.length === 0) {
      await this.prisma.requisicionFlujo.update({
        where: { id: aprobacion.requisicionFlujoId },
        data: {
          estado: 'FINALIZADO',
          finalizadoEn: new Date(),
        },
      });

      const rf = await this.prisma.requisicionFlujo.findUnique({
        where: { id: aprobacion.requisicionFlujoId },
      });

      await this.prisma.requisicion.update({
        where: { id: rf!.requisicionId },
        data: {
          estado: 'AUTORIZADA',
        },
      });
    }

    return { mensaje: 'Aprobado correctamente' };
  }

  async rechazar(aprobacionId: number, usuarioId: number, comentario?: string) {
    const aprobacion = await this.prisma.aprobacion.findUnique({
      where: { id: aprobacionId },
    });

    if (!aprobacion) {
      throw new NotFoundException('Aprobación no encontrada');
    }

    if (aprobacion.estado !== 'PENDIENTE') {
      throw new BadRequestException('Esta aprobación ya fue procesada');
    }

    // marcar como rechazado
    await this.prisma.aprobacion.update({
      where: { id: aprobacionId },
      data: {
        estado: 'RECHAZADO',
        aprobadorId: usuarioId,
        comentario,
        firmadoEn: new Date(),
      },
    });

    // cerrar flujo completo
    const flujo = await this.prisma.requisicionFlujo.update({
      where: { id: aprobacion.requisicionFlujoId },
      data: {
        estado: 'RECHAZADO',
        finalizadoEn: new Date(),
      },
    });

    await this.prisma.requisicion.update({
      where: { id: flujo.requisicionId },
      data: {
        estado: 'RECHAZADA',
      },
    });

    return { mensaje: 'Requisición rechazada correctamente' };
  }

  async obtenerHistorial(requisicionId: number) {
    const rf = await this.prisma.requisicionFlujo.findUnique({
      where: { requisicionId },
      include: {
        aprobaciones: {
          include: {
            paso: true,
            aprobador: true,
          },
          orderBy: {
            firmadoEn: 'asc',
          },
        },
      },
    });

    if (!rf) return [];

    return rf.aprobaciones.map((a) => ({
      paso: a.paso.titulo,
      estado: a.estado,
      usuario: a.aprobador?.nombre ?? '—',
      fecha: a.firmadoEn,
      comentario: a.comentario,
    }));
  }

  async obtenerHistorialGlobal() {
    const aprobaciones = await this.prisma.aprobacion.findMany({
      include: {
        paso: true,
        aprobador: true,
        requisicionFlujo: {
          include: {
            requisicion: true,
          },
        },
      },
      orderBy: {
        firmadoEn: 'desc',
      },
    });

    return aprobaciones.map((a) => ({
      folio: a.requisicionFlujo.requisicion.folio,
      paso: a.paso.titulo,
      estado: a.estado,
      usuario: a.aprobador?.nombre ?? '—',
      fecha: a.firmadoEn,
      comentario: a.comentario,
    }));
  }
}
