import { ApiProperty } from '@nestjs/swagger';

export class ListPacienteDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  documento: string;

  @ApiProperty()
  nombre: string;
}
