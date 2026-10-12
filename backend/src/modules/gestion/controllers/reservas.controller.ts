import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { ListReservaDTO } from '../dtos/output/list-reserva.dto.js';
import { ReservasService } from '../services/reservas.service.js';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';

import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.PACIENTE)
  @ApiOkResponse({
    type: ListReservaDTO,
    isArray: true,
  })
  @Get('pacientes/:idPaciente')
  async listarReservasPaciente(
    @Param('idPaciente', ParseIntPipe) idPaciente: number,
  ): Promise<ListReservaDTO[]> {
    return await this.service.listarReservasPaciente(idPaciente);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.PACIENTE)
  @Post('pacientes/:idPaciente')
  async crearReserva(
    @Param('idPaciente', ParseIntPipe) idPaciente: number,
    @Body() dto: CreateReservaDto,
  ): Promise<{ id: number }> {
    return await this.service.crearReserva(idPaciente, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.PACIENTE)
  @Put('pacientes/:idPaciente/:idReserva/cancelar')
  async cancelarReservaPaciente(
    @Param('idPaciente', ParseIntPipe) idPaciente: number,
    @Param('idReserva', ParseIntPipe) idReserva: number,
  ): Promise<void> {
    await this.service.cancelarReservaPaciente(idReserva, idPaciente);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.ADMINISTRADOR)
  @Put('administradores/:idReserva/cancelar')
  async cancelarReservaAdministrador(
    @Param('idReserva', ParseIntPipe) idReserva: number,
  ): Promise<void> {
    await this.service.cancelarReservaAdministrador(idReserva);
  }
}
