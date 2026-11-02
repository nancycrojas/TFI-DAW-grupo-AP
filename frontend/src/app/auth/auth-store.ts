import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type UsuarioAutenticado = {
  documento: string;
  sub: number;
  rol: 'PACIENTE' | 'MEDICO' | 'ADMINISTRADOR';
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly router: Router = inject(Router);

  guardarToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  obtenerUsuario(): UsuarioAutenticado | null {
    const token = this.obtenerToken();

    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];

      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

      return JSON.parse(decodedPayload) as UsuarioAutenticado;
    } catch {
      return null;
    }
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('accessToken');
    this.router.navigateByUrl('/login');
  }
}
