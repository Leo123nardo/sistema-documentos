/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsOptional, IsString } from 'class-validator';

export class AprobarPasoDto {
  @IsInt()
  requisicionFlujoId!: number;

  @IsInt()
  flujoPasoId!: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsInt()
  usuarioId!: number;
}
