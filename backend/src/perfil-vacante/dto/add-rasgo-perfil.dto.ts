import { IsString } from 'class-validator';

export class AddRasgoPerfilDto {
  @IsString()
  descripcion!: string;
}
