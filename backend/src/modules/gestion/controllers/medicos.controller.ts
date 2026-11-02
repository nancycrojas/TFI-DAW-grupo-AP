import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

import { UpdateMedicoDto } from '../dtos/input/update-medico.dto.js';
import { ListTurnoMedicoDTO } from '../dtos/output/list-turno-medico.dto.js';
import { MedicosService } from '../services/medicos.service.js';
import { ReservasService } from '../services/reservas.service.js';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';

import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';
import { ListMedicoDTO } from '../dtos/output/list-medico.dto.js';

@Controller('medicos')
export class MedicosController {
  constructor(
    private readonly service: MedicosService,
    private readonly reservasService: ReservasService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.ADMINISTRADOR)
  @Put(':id')
  async actualizarValorConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicoDto,
  ): Promise<void> {
    await this.service.actualizarValorConsulta(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.MEDICO)
  @ApiOkResponse({
    type: ListTurnoMedicoDTO,
    isArray: true,
  })
  @ApiQuery({
    name: 'fecha',
    required: true,
    example: '2026-10-10',
  })
  @Get(':idMedico/reservas')
  async listarTurnos(
    @Param('idMedico', ParseIntPipe) idMedico: number,
    @Query('fecha') fecha: string,
  ): Promise<ListTurnoMedicoDTO[]> {
    return await this.reservasService.listarTurnosMedico(idMedico, fecha);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.MEDICO)
  @Put(':idMedico/reservas/:idReserva/atendido')
  async marcarAtendido(
    @Param('idMedico', ParseIntPipe) idMedico: number,
    @Param('idReserva', ParseIntPipe) idReserva: number,
  ): Promise<void> {
    await this.reservasService.marcarAtendido(idMedico, idReserva);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUsuariosEnum.MEDICO)
  @Put(':idMedico/reservas/:idReserva/ausente')
  async marcarAusente(
    @Param('idMedico', ParseIntPipe) idMedico: number,
    @Param('idReserva', ParseIntPipe) idReserva: number,
  ): Promise<void> {
    await this.reservasService.marcarAusente(idMedico, idReserva);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListMedicoDTO,
    isArray: true,
  })
  @Roles(RolesUsuariosEnum.PACIENTE, RolesUsuariosEnum.ADMINISTRADOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async listarMedicos(): Promise<ListMedicoDTO[]> {
    return await this.service.listarMedicos();
  }
}
