import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FlujosService {
  constructor(private readonly prisma: PrismaService) {}

  create(nombre: string, version: string) {
    return this.prisma.flujo.create({
      data: { nombre, version },
    });
  }

  addPaso(flujoId: number, orden: number, titulo: string) {
    return this.prisma.flujoPaso.create({
      data: {
        orden,
        titulo,
        flujo: {
          connect: { id: flujoId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.flujo.findMany({
      include: { pasos: true },
    });
  }
}
