import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FormacionAcademicaService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.formacionAcademica.findMany();
  }

  create(nombre: string) {
    return this.prisma.formacionAcademica.create({
      data: { nombre },
    });
  }
}
