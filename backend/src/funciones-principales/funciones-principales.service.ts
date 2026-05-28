import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateFuncionPrincipalDto } from './dto/create-funcion-principal.dto';

@Injectable()
export class FuncionesPrincipalesService {
  constructor(private readonly prisma: PrismaService) {}

  addFuncion(requisicionId: number, dto: CreateFuncionPrincipalDto) {
    return this.prisma.funcionPrincipal.create({
      data: {
        requisicionId,
        orden: dto.orden,
        descripcion: dto.descripcion,
      },
    });
  }

  findByRequisicion(requisicionId: number) {
    return this.prisma.funcionPrincipal.findMany({
      where: { requisicionId },
      orderBy: { orden: 'asc' },
    });
  }
}
