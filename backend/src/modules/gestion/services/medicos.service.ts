import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateMedicoDto } from '../dtos/input/update-medico.dto.js';
import { Medico } from '../entities/medico.entity.js';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly repository: Repository<Medico>,
  ) {}

  async obtenerMedicoPorId(id: number): Promise<Medico> {
    const medico: Medico | null = await this.repository.findOneBy({ id });

    if (!medico) {
      throw new BadRequestException('Médico no encontrado');
    }

    return medico;
  }

  async actualizarValorConsulta(
    id: number,
    dto: UpdateMedicoDto,
  ): Promise<void> {
    const medico: Medico = await this.obtenerMedicoPorId(id);

    this.repository.merge(medico, dto);

    await this.repository.save(medico);
  }
}
