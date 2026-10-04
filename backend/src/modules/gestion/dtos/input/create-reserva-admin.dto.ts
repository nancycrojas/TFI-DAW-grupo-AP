import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto.js';

export class CreateReservaAdminDto extends CreateReservaDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  idPaciente: number;
}
