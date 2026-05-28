import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AprobacionesService } from './aprobaciones.service';
import type { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequisicionService } from '../requisicion/requisicion.service';

@Controller('aprobaciones')
export class AprobacionesController {
  constructor(
    private readonly aprobacionesService: AprobacionesService,
    private readonly requisicionService: RequisicionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('aprobar')
  aprobar(@Body() body: { aprobacionId: number }, @Req() req: RequestWithUser) {
    const usuarioId = req.user.sub;

    console.log('Usuario autenticado:', usuarioId);
    console.log('Aprobacion ID:', body.aprobacionId);

    return this.requisicionService.aprobar(body.aprobacionId, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rechazar')
  rechazar(
    @Body() body: { aprobacionId: number; comentario?: string },
    @Req() req: RequestWithUser,
  ) {
    const usuarioId = req.user.sub;

    return this.requisicionService.rechazar(
      body.aprobacionId,
      usuarioId,
      body.comentario,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('pendientes')
  pendientes(@Req() req: RequestWithUser) {
    const usuarioId = req.user.sub;
    return this.requisicionService.obtenerPendientes(usuarioId);
  }
}
