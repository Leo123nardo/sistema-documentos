import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EquiposMaquinariaService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.equipoMaquinaria.findMany();
  }

  create(nombre: string) {
    return this.prisma.equipoMaquinaria.create({
      data: { nombre },
    });
  }
}
