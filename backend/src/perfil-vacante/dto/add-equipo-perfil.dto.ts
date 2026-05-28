/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt } from 'class-validator';

export class AddEquipoPerfilDto {
  @IsInt()
  equipoId!: number;
}
