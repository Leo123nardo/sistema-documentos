import { IsInt, IsString } from 'class-validator';

export class AddConocimientoPerfilDto {
  @IsString()
  descripcion!: string;

  @IsInt()
  tiempoMeses!: number;
}
