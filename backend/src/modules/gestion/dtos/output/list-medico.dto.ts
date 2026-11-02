import { ApiProperty } from '@nestjs/swagger';

export class ListMedicoDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  matricula: number;

  @ApiProperty()
  valorConsulta: number;
}
