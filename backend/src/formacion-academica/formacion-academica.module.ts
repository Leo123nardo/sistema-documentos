import { Module } from '@nestjs/common';
import { FormacionAcademicaService } from './formacion-academica.service';
import { FormacionAcademicaController } from './formacion-academica.controller';

@Module({
  providers: [FormacionAcademicaService],
  controllers: [FormacionAcademicaController],
})
export class FormacionAcademicaModule {}
