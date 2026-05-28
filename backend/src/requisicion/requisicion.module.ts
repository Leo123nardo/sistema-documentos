import { Module } from '@nestjs/common';
import { RequisicionService } from './requisicion.service';
import { RequisicionController } from './requisicion.controller';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [PdfModule],
  providers: [RequisicionService],
  controllers: [RequisicionController],
  exports: [RequisicionService],
})
export class RequisicionModule {}
