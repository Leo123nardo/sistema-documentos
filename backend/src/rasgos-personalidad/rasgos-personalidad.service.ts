import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RasgosPersonalidadService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.rasgoPersonalidad.findMany();
  }

  create(descripcion: string) {
    return this.prisma.rasgoPersonalidad.create({
      data: { descripcion },
    });
  }
}
