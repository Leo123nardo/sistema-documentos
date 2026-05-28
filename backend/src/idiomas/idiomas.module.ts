import { Module } from '@nestjs/common';
import { IdiomasService } from './idiomas.service';
import { IdiomasController } from './idiomas.controller';

@Module({
  providers: [IdiomasService],
  controllers: [IdiomasController]
})
export class IdiomasModule {}
