import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListPacienteDTO } from '../dtos/output/list-paciente.dto.js';
import { Usuario } from '../entities/usuario.entity.js';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum.js';
import { RolesUsuariosEnum } from '../enums/roles-usuarios.enum.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
  ) {}

  async buscarUsuarioActivoPorDocumento(
    documento: string,
  ): Promise<Usuario | null> {
    return await this.repository.findOne({
      where: {
        documento: documento,
        estado: EstadosUsuariosEnum.ACTIVO,
      },
    });
  }

  async listarPacientesActivos(): Promise<ListPacienteDTO[]> {
    const usuarios: Usuario[] = await this.repository.find({
      where: {
        estado: EstadosUsuariosEnum.ACTIVO,
        rol: RolesUsuariosEnum.PACIENTE,
      },
      order: {
        apellidos: 'ASC',
        nombres: 'ASC',
      },
    });

    const dtoList: ListPacienteDTO[] = [];

    for (const u of usuarios) {
      const dto = new ListPacienteDTO();

      dto.id = u.id;
      dto.documento = u.documento;
      dto.nombre = `${u.apellidos}, ${u.nombres}`;

      dtoList.push(dto);
    }

    return dtoList;
  }
}
