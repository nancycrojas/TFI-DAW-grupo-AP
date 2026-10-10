import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario } from '../auth/entities/usuario.entity.js';
import { Medico } from './entities/medico.entity.js';
import { Reserva } from './entities/reserva.entity.js';
import { MedicosService } from './services/medicos.service.js';

import { MedicosController } from './controllers/medicos.controller.js';
import { ReservasController } from './controllers/reservas.controller.js';
import { ReservasService } from './services/reservas.service.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Medico, Reserva]), AuthModule],
  controllers: [ReservasController, MedicosController],
  providers: [ReservasService, MedicosService],
  exports: [],
})
export class GestionModule {}
