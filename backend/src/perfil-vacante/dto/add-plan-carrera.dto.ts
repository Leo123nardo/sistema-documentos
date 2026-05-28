/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt } from 'class-validator';

export class AddPlanCarreraDto {
  @IsInt()
  puestoId!: number;

  @IsInt()
  orden!: number;
}
