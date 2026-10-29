import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

import {
  UsuarioActual,
  type UsuarioToken,
} from '../../auth/decorators/usuario-actual.decorator.js';

import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { ListReservaDTO } from '../dtos/output/list-reserva.dto.js';
import { ReservasService } from '../services/reservas.service.js';

import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';

import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListReservaDTO,
    isArray: true,
  })
  @ApiQuery({
    name: 'fecha',
    required: false,
    example: '2026-10-30',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: EstadosReservasEnum,
  })
  @Roles(
    RolesUsuariosEnum.MEDICO,
    RolesUsuariosEnum.PACIENTE,
    RolesUsuariosEnum.ADMINISTRADOR,
  )
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async listarReservas(
    @UsuarioActual() usuario: UsuarioToken,
    @Query('fecha') fecha?: string,
    @Query('estado') estado?: EstadosReservasEnum,
  ) {
    if (usuario.rol === RolesUsuariosEnum.MEDICO) {
      if (!fecha) {
        throw new BadRequestException('Se debe indicar la fecha');
      }

      return await this.service.listarTurnosMedico(usuario.sub, fecha);
    }

    if (usuario.rol === RolesUsuariosEnum.PACIENTE) {
      return await this.service.listarReservasPaciente(usuario.sub, estado);
    }

    return await this.service.listarTodas(estado);
  }

  @ApiBearerAuth()
  @Roles(RolesUsuariosEnum.PACIENTE, RolesUsuariosEnum.ADMINISTRADOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async crearReserva(
    @Body() dto: CreateReservaDto,
    @UsuarioActual() usuario: UsuarioToken,
  ): Promise<{ id: number }> {
    return await this.service.crearReserva(dto, usuario);
  }

  @ApiBearerAuth()
  @Roles(RolesUsuariosEnum.PACIENTE, RolesUsuariosEnum.ADMINISTRADOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id/cancelar')
  async cancelarReserva(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioToken,
  ): Promise<void> {
    if (usuario.rol === RolesUsuariosEnum.PACIENTE) {
      await this.service.cancelarReservaPaciente(id, usuario.sub);

      return;
    }

    await this.service.cancelarReservaAdministrador(id);
  }

  @ApiBearerAuth()
  @Roles(RolesUsuariosEnum.MEDICO)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id/atendido')
  async marcarAtendido(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioToken,
  ): Promise<void> {
    await this.service.marcarAtendido(id, usuario.sub);
  }

  @ApiBearerAuth()
  @Roles(RolesUsuariosEnum.MEDICO)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id/ausente')
  async marcarAusente(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: UsuarioToken,
  ): Promise<void> {
    await this.service.marcarAusente(id, usuario.sub);
  }
}
