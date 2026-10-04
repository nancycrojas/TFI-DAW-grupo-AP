import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateMedicoDto {
  @ApiProperty({ example: 25000 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  valorConsulta: number;
}
