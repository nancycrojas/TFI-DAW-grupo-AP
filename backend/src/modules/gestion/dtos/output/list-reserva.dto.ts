import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';

export class ListReservaDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  idMedico: number;

  @ApiProperty()
  fechaHora: Date;

  @ApiProperty({
    enum: EstadosReservasEnum,
    example: EstadosReservasEnum.ACTIVO,
  })
  estado: EstadosReservasEnum;

  @ApiProperty()
  valorConsulta: number;
}
