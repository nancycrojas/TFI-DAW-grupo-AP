import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { ListReservaDTO } from '../dtos/output/list-reserva.dto.js';
import { ReservasService } from '../services/reservas.service.js';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @ApiBearerAuth()
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

  @Post('pacientes/:idPaciente')
  async crearReserva(
    @Param('idPaciente', ParseIntPipe) idPaciente: number,
    @Body() dto: CreateReservaDto,
  ): Promise<{ id: number }> {
    return await this.service.crearReserva(idPaciente, dto);
  }
}
