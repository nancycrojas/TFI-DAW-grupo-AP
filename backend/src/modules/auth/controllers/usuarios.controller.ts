import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { ListPacienteDTO } from '../dtos/output/list-paciente.dto.js';
import { UsuariosService } from '../services/usuarios.service.js';

import { Roles } from '../decorators/roles.decorator.js';
import { RolesUsuariosEnum } from '../enums/roles-usuarios.enum.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListPacienteDTO,
    isArray: true,
  })
  @Roles(RolesUsuariosEnum.ADMINISTRADOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('pacientes')
  async listarPacientes(): Promise<ListPacienteDTO[]> {
    return await this.service.listarPacientesActivos();
  }
}
