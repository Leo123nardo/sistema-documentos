import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class IdiomasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.idioma.findMany();
  }

  create(nombre: string) {
    return this.prisma.idioma.create({
      data: { nombre },
    });
  }
}
