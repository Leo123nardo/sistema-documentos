import { IsString, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateRequisicionDto {
  @IsDateString()
  fechaSolicitud!: string;

  @IsInt()
  departamentoId!: number;

  @IsOptional()
  @IsString()
  nombreJefe?: string;

  @IsOptional()
  @IsInt()
  personalCargo?: number;

  @IsOptional()
  @IsString()
  puestoSolicitado?: string;

  @IsOptional()
  @IsString()
  proyectoPlanta?: string;

  @IsInt()
  cantidadRequerida!: number;
}
