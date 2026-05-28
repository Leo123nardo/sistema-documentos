import { Module } from '@nestjs/common';
import { FuncionesPrincipalesService } from './funciones-principales.service';
import { FuncionesPrincipalesController } from './funciones-principales.controller';

@Module({
  providers: [FuncionesPrincipalesService],
  controllers: [FuncionesPrincipalesController]
})
export class FuncionesPrincipalesModule {}
