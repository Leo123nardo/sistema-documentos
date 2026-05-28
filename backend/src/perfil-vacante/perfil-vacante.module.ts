import { Module } from '@nestjs/common';
import { PerfilVacanteService } from './perfil-vacante.service';
import { PerfilVacanteController } from './perfil-vacante.controller';
import { PrismaModule } from '../../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [PerfilVacanteService],
  controllers: [PerfilVacanteController],
  exports: [PerfilVacanteService],
})
export class PerfilVacanteModule {}
