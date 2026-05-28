import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AprobarPasoDto } from './dto/aprobar-paso.dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

type Pendiente = {
  aprobacionId: number;
  requisicionId: number;
  folio: string;
  puesto: string | null;
  rol: string | null;
  paso: string;
  progreso: string;
};

@Injectable()
export class AprobacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  //Paso Activo: el siguiente paso que se debe aprobar
  private async getNextApprovableStep(requisicionFlujoId: number) {
    const rf = await this.prisma.requisicionFlujo.findUnique({
      where: { id: requisicionFlujoId },
      include: {
        flujo: {
          include: {
            pasos: {
              orderBy: { orden: 'asc' },
            },
          },
        },
        aprobaciones: true,
      },
    });

    if (!rf) {
      throw new NotFoundException(
        'No existe el flujo asignado a la requisición',
      );
    }

    const pasosAprobados = rf.aprobaciones
      .filter((a) => a.estado === 'APROBADO')
      .map((a) => a.flujoPasoId);

    const siguientePaso = rf.flujo.pasos.find(
      (paso) => !pasosAprobados.includes(paso.id),
    );

    return { rf, siguientePaso };
  }

  //Aprobar Paso
  async aprobarPaso(
    dto: AprobarPasoDto,
    aprobadorId: number,
    ip?: string,
    userAgent?: string,
  ) {
    console.log('📦 DTO COMPLETO:', dto);
    console.log('➡️ requisicionFlujoId:', dto.requisicionFlujoId);
    console.log('➡️ flujoPasoId:', dto.flujoPasoId);
    console.log('➡️ usuarioId:', aprobadorId);

    const { rf, siguientePaso } = await this.getNextApprovableStep(
      dto.requisicionFlujoId,
    );

    if (!siguientePaso) {
      throw new BadRequestException(
        'El flujo ya se encuentra completamente aprobado',
      );
    }

    if (siguientePaso.id !== dto.flujoPasoId) {
      throw new BadRequestException(
        `No puede aprobar este paso. El paso válido es: ${siguientePaso.titulo}`,
      );
    }

    const paso = await this.prisma.flujoPaso.findUnique({
      where: { id: siguientePaso.id },
    });

    if (!paso) {
      throw new NotFoundException('El paso del flujo no existe');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: aprobadorId },
      include: {
        roles: { include: { rol: true } },
        puesto: true,
        departamento: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    //Obtener roles del usuario
    const rolesUsuario = usuario.roles.map((r) => r.rol.id);

    if (rolesUsuario.length === 0) {
      throw new ForbiddenException(
        'No tienes permisos para aprobar ningún paso',
      );
    }

    if (!paso.rolId || !rolesUsuario.includes(paso.rolId)) {
      throw new ForbiddenException(
        'No tienes autorización para aprobar este paso',
      );
    }

    if (paso.puestoId && usuario.puestoId !== paso.puestoId) {
      throw new ForbiddenException(
        'No coincide el puesto del usuario con el requerido',
      );
    }

    if (paso.departamentoId && usuario.departamentoId !== paso.departamentoId) {
      throw new ForbiddenException(
        'No coincide el departamento del usuario con el requerido',
      );
    }

    const aprobacion = await this.prisma.aprobacion.update({
      where: {
        requisicionFlujoId_flujoPasoId: {
          requisicionFlujoId: dto.requisicionFlujoId,
          flujoPasoId: dto.flujoPasoId,
        },
      },
      data: {
        estado: 'APROBADO',
        aprobadorId,
        comentario: dto.comentario,
        firmadoEn: new Date(),
        ip,
        userAgent,
      },
    });

    const { siguientePaso: pasoPendiente } = await this.getNextApprovableStep(
      dto.requisicionFlujoId,
    );

    if (!pasoPendiente) {
      //Cierre de flujo
      await this.prisma.requisicionFlujo.update({
        where: { id: rf.id },
        data: {
          estado: 'FINALIZADO',
          finalizadoEn: new Date(),
        },
      });

      //Cierre de requisición
      await this.prisma.requisicion.update({
        where: { id: rf.requisicionId },
        data: {
          estado: 'AUTORIZADA',
        },
      });
    }
    return aprobacion;
  }

  //Rechazar paso
  async rechazar(
    aprobacionId: number,
    aprobadorId: number,
    comentario?: string,
    ip?: string,
    userAgent?: string,
  ) {
    // buscar aprobación directamente
    const aprobacion = await this.prisma.aprobacion.findUnique({
      where: { id: aprobacionId },
    });

    if (!aprobacion) {
      throw new BadRequestException('Aprobación no encontrada');
    }

    if (aprobacion.estado !== 'PENDIENTE') {
      throw new BadRequestException('Esta aprobación ya fue procesada');
    }

    // actualizar aprobación
    const updated = await this.prisma.aprobacion.update({
      where: { id: aprobacionId },
      data: {
        estado: 'RECHAZADO',
        aprobadorId,
        comentario,
        firmadoEn: new Date(),
        ip,
        userAgent,
      },
    });

    // cerrar flujo completo
    await this.prisma.requisicionFlujo.update({
      where: { id: aprobacion.requisicionFlujoId },
      data: {
        estado: 'RECHAZADO',
        finalizadoEn: new Date(),
      },
    });

    return updated;
  }

  async obtenerPendientes(usuarioId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        roles: {
          include: { rol: true },
        },
      },
    });

    const rolesUsuario = usuario?.roles.map((r) => r.rol.id) ?? [];

    if (rolesUsuario.length === 0) return [];

    const flujos = await this.prisma.requisicionFlujo.findMany({
      where: {
        estado: 'EN_REVISION',
      },
      include: {
        requisicion: true,
        aprobaciones: {
          include: {
            paso: true,
          },
          orderBy: {
            paso: { orden: 'asc' },
          },
        },
      },
    });

    const pendientes: Pendiente[] = [];

    for (const rf of flujos) {
      // encontrar PRIMER paso pendiente (paso activo)
      const pasoActivo = rf.aprobaciones.find((a) => a.estado === 'PENDIENTE');

      if (!pasoActivo) continue;

      const rolPasoId = pasoActivo.paso.rolId;

      // validar si el usuario puede ver este paso
      if (!rolPasoId || !rolesUsuario.includes(rolPasoId)) continue;

      const total = rf.aprobaciones.length;

      const aprobados = rf.aprobaciones.filter(
        (a) => a.estado === 'APROBADO',
      ).length;

      pendientes.push({
        aprobacionId: pasoActivo.id,
        requisicionId: rf.requisicion.id,
        folio: rf.requisicion.folio,
        puesto: rf.requisicion.puestoSolicitado ?? null,
        rol:
          usuario?.roles.find((r) => r.rol.id === rolPasoId)?.rol.nombre ?? '',
        paso: pasoActivo.paso.titulo,
        progreso: `${aprobados}/${total}`,
      });
    }

    return pendientes;
  }
}
