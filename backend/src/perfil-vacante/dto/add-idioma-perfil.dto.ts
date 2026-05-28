/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt } from 'class-validator';

export class AddIdiomaPerfilDto {
  @IsInt()
  idiomaId!: number;

  @IsInt()
  pctLeido!: number;

  @IsInt()
  pctHablado!: number;

  @IsInt()
  pctEscrito!: number;
}
