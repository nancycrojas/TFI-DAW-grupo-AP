import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Usuario } from '../../auth/entities/usuario.entity.js';
import type { Reserva } from './reserva.entity.js';

@Entity({ name: 'medicos' })
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @Column()
  matricula: number;

  @Column({ name: 'valor_consulta' })
  valorConsulta: number;

  @OneToOne('Usuario')
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany('Reserva', (reserva: Reserva) => reserva.medico)
  reservas: Reserva[];
}
