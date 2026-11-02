import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EstadosReservasEnum } from '../estados-reservas-enum';
import { ListReservaDTO } from './list-reserva-dto';

@Injectable({
  providedIn: 'root',
})
export class ReservasListadoApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  obtenerReservas(estado?: EstadosReservasEnum, fecha?: string): Observable<ListReservaDTO[]> {
    const params: Record<string, string> = {};

    if (estado) {
      params['estado'] = estado;
    }

    if (fecha) {
      params['fecha'] = fecha;
    }

    return this.httpClient.get<ListReservaDTO[]>('/api/v1/reservas', { params });
  }

  cancelarReserva(id: number): Observable<void> {
    return this.httpClient.put<void>(`/api/v1/reservas/${id}/cancelar`, {});
  }

  marcarAtendido(id: number): Observable<void> {
    return this.httpClient.put<void>(`/api/v1/reservas/${id}/atendido`, {});
  }

  marcarAusente(id: number): Observable<void> {
    return this.httpClient.put<void>(`/api/v1/reservas/${id}/ausente`, {});
  }
}
