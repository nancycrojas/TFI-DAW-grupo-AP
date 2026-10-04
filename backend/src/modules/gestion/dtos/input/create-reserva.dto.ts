import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateReservaDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  idMedico: number;

  @ApiProperty({
    example: '2026-10-15T10:00:00',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaHora: string;
}
