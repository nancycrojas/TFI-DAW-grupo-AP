import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginController } from './controllers/login.controller.js';
import { Usuario } from './entities/usuario.entity.js';

import { AuthGuard } from './guards/auth.guard.js';
import { AuthService } from './services/auth.service.js';
import { UsuariosService } from './services/usuarios.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '8h',
        },
      }),
    }),
  ],

  controllers: [LoginController],

  providers: [UsuariosService, AuthService, AuthGuard],

  exports: [AuthGuard],
})
export class AuthModule {}
