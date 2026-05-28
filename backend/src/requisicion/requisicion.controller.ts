import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { RequisicionService } from './requisicion.service';
import type { Response } from 'express';
import { CreateRequisicionDto } from './create-requisicion.dto';
import { AssignFlujoDto } from './dto/assign-flujo.dto';
import { PdfService } from '../pdf/pdf.service';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('requisiciones')
export class RequisicionController {
  constructor(
    private readonly requisicionService: RequisicionService,
    private readonly pdfService: PdfService,
  ) {}

  @Get()
  findAll() {
    return this.requisicionService.findAll();
  }

  @Post()
  create(@Body() body: CreateRequisicionDto) {
    return this.requisicionService.create(body);
  }

  @Get('historial-global')
  getHistorialGlobal() {
    return this.requisicionService.obtenerHistorialGlobal();
  }

  @Post(':id/flujo')
  assignFlujo(@Param('id') id: string, @Body() body: AssignFlujoDto) {
    return this.requisicionService.assignFlujo(Number(id), body.flujoId);
  }

  @Get(':id/flujo')
  getEstadoFlujo(@Param('id') id: string) {
    return this.requisicionService.getEstadoFlujo(Number(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisicionService.findOne(Number(id));
  }

  @Post(':id/finalizar')
  finalizar(@Param('id') id: string) {
    return this.requisicionService.finalizar(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/firmar')
  firmar(@Param('id') id: string, @Req() req: RequestWithUser) {
    const usuarioId = req.user.sub;
    return this.requisicionService.firmarRequisicion(Number(id), usuarioId);
  }
  @Get(':id/pdf')
  async obtenerPdf(
    @Param('id') id: string,
    @Query('dl') dl: string | undefined,
    @Res() res: Response,
  ) {
    const pdf = await this.pdfService.generarRequisicionPDF(Number(id));
    const isDownload = dl === '1';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${isDownload ? 'attachment' : 'inline'}; filename=requisicion.pdf`,
    );
    res.end(pdf);
  }
  @Get(':id/autorizaciones')
  async obtenerAutorizaciones(@Param('id') id: string) {
    return this.requisicionService.obtenerAutorizaciones(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('aprobaciones/:id/aprobar')
  aprobar(@Param('id') id: string, @Req() req: RequestWithUser) {
    const usuarioId = req.user.sub;

    return this.requisicionService.aprobar(Number(id), usuarioId);
  }

  @Get(':id/historial')
  getHistorial(@Param('id') id: string) {
    return this.requisicionService.obtenerHistorial(Number(id));
  }
}
