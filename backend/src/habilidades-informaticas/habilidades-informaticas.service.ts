import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HabilidadesInformaticasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.habilidadInformatica.findMany();
  }

  create(nombre: string) {
    return this.prisma.habilidadInformatica.create({
      data: { nombre },
    });
  }
}
