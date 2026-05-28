import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ConocimientosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.conocimiento.findMany();
  }

  create(descripcion: string) {
    return this.prisma.conocimiento.create({
      data: { descripcion },
    });
  }
}
