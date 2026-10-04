import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario } from '../auth/entities/usuario.entity.js';
import { Medico } from './entities/medico.entity.js';
import { Reserva } from './entities/reserva.entity.js';

import { ReservasController } from './controllers/reservas.controller.js';
import { ReservasService } from './services/reservas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Medico, Reserva])],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [],
})
export class GestionModule {}
