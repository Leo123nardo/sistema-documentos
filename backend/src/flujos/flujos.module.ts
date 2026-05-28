import { Module } from '@nestjs/common';
import { FlujosService } from './flujos.service';
import { FlujosController } from './flujos.controller';

@Module({
  providers: [FlujosService],
  controllers: [FlujosController],
})
export class FlujosModule {}
