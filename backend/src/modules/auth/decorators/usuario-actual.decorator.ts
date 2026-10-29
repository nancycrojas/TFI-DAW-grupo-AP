import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RolesUsuariosEnum } from '../enums/roles-usuarios.enum.js';

export type UsuarioToken = {
  documento: string;
  sub: number;
  rol: RolesUsuariosEnum;
};

export const UsuarioActual = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UsuarioToken => {
    const request = context.switchToHttp().getRequest<{
      usuario: UsuarioToken;
    }>();

    return request.usuario;
  },
);
