import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservasEnum } from '../../enums/estados-reservas.enum.js';

export class ListTurnoMedicoDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  idPaciente: number;

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
