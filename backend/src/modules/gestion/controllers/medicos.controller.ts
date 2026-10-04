import { Body, Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UpdateMedicoDto } from '../dtos/input/update-medico.dto.js';
import { MedicosService } from '../services/medicos.service.js';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly service: MedicosService) {}

  @ApiBearerAuth()
  @Put(':id')
  async actualizarValorConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicoDto,
  ): Promise<void> {
    await this.service.actualizarValorConsulta(id, dto);
  }
}
