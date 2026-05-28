/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsString } from 'class-validator';

export class CreateFuncionPrincipalDto {
  @IsInt()
  orden!: number;

  @IsString()
  descripcion!: string;
}
