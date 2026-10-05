import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../../auth/entities/usuario.entity.js';
import type { Medico } from '../entities/medico.entity.js';
import { Reserva } from '../entities/reserva.entity.js';
import { MedicosService } from './medicos.service.js';

import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';

import { EstadosUsuariosEnum } from '../../auth/enums/estados-usuarios.enum.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { ListReservaDTO } from '../dtos/output/list-reserva.dto.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly repository: Repository<Reserva>,

    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,

    private readonly medicosService: MedicosService,
  ) {}

  async crearReserva(
    idPaciente: number,
    dto: CreateReservaDto,
  ): Promise<{ id: number }> {
    const paciente = await this.usuariosRepository.findOne({
      where: {
        id: idPaciente,
      },
    });

    if (!paciente) {
      throw new BadRequestException('El paciente indicado no existe');
    }

    if (paciente.estado !== EstadosUsuariosEnum.ACTIVO) {
      throw new BadRequestException('El paciente no se encuentra activo');
    }

    if (paciente.rol !== RolesUsuariosEnum.PACIENTE) {
      throw new BadRequestException('El usuario indicado no es un paciente');
    }

    const medico: Medico = await this.medicosService.obtenerMedicoPorId(
      dto.idMedico,
    );

    const fechaHora = new Date(dto.fechaHora);

    this.validarFechaReserva(fechaHora);

    const reservaExistente = await this.repository.findOne({
      where: {
        idMedico: dto.idMedico,
        fechaHora,
        estado: EstadosReservasEnum.ACTIVO,
      },
    });

    if (reservaExistente) {
      throw new BadRequestException(
        'El médico ya tiene un turno reservado en ese horario',
      );
    }

    const reserva = this.repository.create();

    reserva.idMedico = dto.idMedico;
    reserva.idPaciente = idPaciente;
    reserva.fechaHora = fechaHora;
    reserva.estado = EstadosReservasEnum.ACTIVO;

    reserva.valorConsulta = medico.valorConsulta;

    await this.repository.save(reserva);

    return {
      id: reserva.id,
    };
  }
  private validarFechaReserva(fechaHora: Date): void {
    const ahora = new Date();

    if (fechaHora <= ahora) {
      throw new BadRequestException(
        'La fecha del turno debe ser posterior a la fecha actual',
      );
    }

    const limite = new Date(ahora);
    limite.setDate(limite.getDate() + 30);

    if (fechaHora > limite) {
      throw new BadRequestException(
        'Los turnos solo pueden reservarse con hasta 30 días de anticipación',
      );
    }

    const hora = fechaHora.getHours();

    if (
      hora < 8 ||
      hora >= 16 ||
      fechaHora.getMinutes() !== 0 ||
      fechaHora.getSeconds() !== 0
    ) {
      throw new BadRequestException(
        'Los turnos deben comenzar entre las 8 y las 15 horas, en horarios exactos',
      );
    }
  }
  async listarReservasPaciente(idPaciente: number): Promise<ListReservaDTO[]> {
    const reservas: Reserva[] = await this.repository.find({
      where: {
        idPaciente: idPaciente,
      },
      order: {
        fechaHora: 'ASC',
      },
    });

    const dtoList: ListReservaDTO[] = [];

    for (const r of reservas) {
      const dto = new ListReservaDTO();

      dto.id = r.id;
      dto.idMedico = r.idMedico;
      dto.fechaHora = r.fechaHora;
      dto.estado = r.estado;
      dto.valorConsulta = r.valorConsulta;

      dtoList.push(dto);
    }

    return dtoList;
  }

  async cancelarReservaPaciente(
    idReserva: number,
    idPaciente: number,
  ): Promise<void> {
    const reserva: Reserva | null = await this.repository.findOne({
      where: {
        id: idReserva,
        idPaciente: idPaciente,
      },
    });

    if (!reserva) {
      throw new BadRequestException('La reserva indicada no existe');
    }

    if (reserva.estado !== EstadosReservasEnum.ACTIVO) {
      throw new BadRequestException('La reserva no se encuentra activa');
    }

    const hoy = new Date();
    const fechaReserva = new Date(reserva.fechaHora);

    hoy.setHours(0, 0, 0, 0);
    fechaReserva.setHours(0, 0, 0, 0);

    if (fechaReserva <= hoy) {
      throw new BadRequestException(
        'La reserva solo puede cancelarse hasta el día anterior a la consulta',
      );
    }

    reserva.estado = EstadosReservasEnum.CANCELADO;

    await this.repository.save(reserva);
  }

  async cancelarReservaAdministrador(idReserva: number): Promise<void> {
    const reserva: Reserva | null = await this.repository.findOneBy({
      id: idReserva,
    });

    if (!reserva) {
      throw new BadRequestException('La reserva indicada no existe');
    }

    if (reserva.estado !== EstadosReservasEnum.ACTIVO) {
      throw new BadRequestException('La reserva no se encuentra activa');
    }

    const ahora = new Date();

    if (reserva.fechaHora <= ahora) {
      throw new BadRequestException(
        'No se puede cancelar una reserva cuya consulta ya comenzó',
      );
    }

    reserva.estado = EstadosReservasEnum.CANCELADO;

    await this.repository.save(reserva);
  }
}
