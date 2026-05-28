/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
export enum SexoEnum {
  M = 'M',
  F = 'F',
  NA = 'NA',
}

export enum HorarioLaboralEnum {
  TIEMPO_COMPLETO = 'TIEMPO_COMPLETO',
  MEDIO_TIEMPO = 'MEDIO_TIEMPO',
}

export enum GradoEstudioEnum {
  SECUNDARIA = 'SECUNDARIA',
  PREPARATORIA = 'PREPARATORIA',
  LICENCIATURA = 'LICENCIATURA',
  MAESTRIA = 'MAESTRIA',
}

export class UpdatePerfilVacanteDto {
  // ─────────────────────────────
  // DATOS GENERALES (PASO 1)
  // ─────────────────────────────
  @IsOptional()
  @IsInt()
  edadMinima?: number;

  @IsOptional()
  @IsEnum(SexoEnum)
  sexo?: SexoEnum;

  @IsOptional()
  @IsInt()
  edadMaxima?: number;

  @IsOptional()
  @IsInt()
  anosExperiencia?: number;

  @IsOptional()
  @IsInt()
  sueldoMin?: number;

  @IsOptional()
  @IsInt()
  sueldoMax?: number;

  @IsOptional()
  @IsString()
  nivelPuesto?: string;

  @IsOptional()
  @IsString()
  generacionVacante?: string;

  // ─────────────────────────────
  // CONDICIONES / PERFIL AVANZADO
  // ─────────────────────────────
  @IsOptional()
  @IsEnum(HorarioLaboralEnum)
  horarioLaboral?: HorarioLaboralEnum;

  @IsOptional()
  @IsEnum(GradoEstudioEnum)
  gradoEstudio?: GradoEstudioEnum;

  @IsOptional()
  @IsBoolean()
  viaje?: boolean;

  @IsOptional()
  @IsBoolean()
  auto?: boolean;

  @IsOptional()
  @IsBoolean()
  cambioResidencia?: boolean;
}
