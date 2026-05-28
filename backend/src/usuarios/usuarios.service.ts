import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
      // ❗ NO uses select aquí
      include: {
        departamento: true,
        puesto: true,
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });
  }
}
