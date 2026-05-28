import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequisicionModule } from './requisicion/requisicion.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfilVacanteModule } from './perfil-vacante/perfil-vacante.module';
import { IdiomasModule } from './idiomas/idiomas.module';
import { ConocimientosModule } from './conocimientos/conocimientos.module';
import { HabilidadesInformaticasModule } from './habilidades-informaticas/habilidades-informaticas.module';
import { EquiposMaquinariaModule } from './equipos-maquinaria/equipos-maquinaria.module';
import { RasgosPersonalidadModule } from './rasgos-personalidad/rasgos-personalidad.module';
import { FuncionesPrincipalesModule } from './funciones-principales/funciones-principales.module';
import { FormacionAcademicaModule } from './formacion-academica/formacion-academica.module';
import { PuestosModule } from './puestos/puestos.module';
import { AprobacionesModule } from './aprobaciones/aprobaciones.module';
import { AprobacionesService } from './aprobaciones/aprobaciones.service';
import { FlujosModule } from './flujos/flujos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    RequisicionModule,
    PrismaModule,
    PerfilVacanteModule,
    IdiomasModule,
    ConocimientosModule,
    HabilidadesInformaticasModule,
    EquiposMaquinariaModule,
    RasgosPersonalidadModule,
    FuncionesPrincipalesModule,
    FormacionAcademicaModule,
    PuestosModule,
    AprobacionesModule,
    RequisicionModule,
    FlujosModule,
    NotificacionesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AprobacionesService],
})
export class AppModule {}
