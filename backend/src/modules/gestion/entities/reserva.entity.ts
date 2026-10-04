import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';

import type { Usuario } from '../../auth/entities/usuario.entity.js';
import type { Medico } from './medico.entity.js';

@Entity({ name: 'reservas' })
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_medico' })
  idMedico: number;

  @Column({ name: 'id_paciente' })
  idPaciente: number;

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date;

  @Column({ type: 'enum', enum: EstadosReservasEnum })
  estado: EstadosReservasEnum;

  @Column({ name: 'valor_consulta' })
  valorConsulta: number;

  @ManyToOne('Medico')
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @ManyToOne('Usuario')
  @JoinColumn({ name: 'id_paciente' })
  paciente: Usuario;
}
