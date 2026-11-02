import { EstadosReservasEnum } from '../estados-reservas-enum';

export interface ListReservaDTO {
  id: number;
  idMedico: number;
  idPaciente: number;
  medico?: string;
  paciente?: string;
  fechaHora: string;
  estado: EstadosReservasEnum;
  valorConsulta: number;
}
