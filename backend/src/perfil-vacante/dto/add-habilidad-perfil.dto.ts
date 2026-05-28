/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt } from 'class-validator';

export class AddHabilidadPerfilDto {
  @IsInt()
  habilidadId!: number;
}
