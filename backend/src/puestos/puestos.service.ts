import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PuestosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.puesto.findMany();
  }

  create(nombre: string) {
    return this.prisma.puesto.create({
      data: { nombre },
    });
  }
}
