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

@Controller('medicos')
export class MedicosController {
  constructor(
    private readonly service: MedicosService,
    private readonly reservasService: ReservasService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async actualizarValorConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicoDto,
  ): Promise<void> {
    await this.service.actualizarValorConsulta(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  @Put(':idMedico/reservas/:idReserva/atendido')
  async marcarAtendido(
    @Param('idMedico', ParseIntPipe) idMedico: number,
    @Param('idReserva', ParseIntPipe) idReserva: number,
  ): Promise<void> {
    await this.reservasService.marcarAtendido(idMedico, idReserva);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':idMedico/reservas/:idReserva/ausente')
  async marcarAusente(
    @Param('idMedico', ParseIntPipe) idMedico: number,
    @Param('idReserva', ParseIntPipe) idReserva: number,
  ): Promise<void> {
    await this.reservasService.marcarAusente(idMedico, idReserva);
  }
}
