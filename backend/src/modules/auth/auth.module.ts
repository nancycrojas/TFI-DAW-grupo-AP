import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginController } from './controllers/login.controller.js';
import { Usuario } from './entities/usuario.entity.js';
@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [LoginController],
  providers: [],
  exports: [],
})
export class AuthModule {}
