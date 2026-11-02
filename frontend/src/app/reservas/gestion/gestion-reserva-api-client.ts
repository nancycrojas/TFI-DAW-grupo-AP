import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateReservaDTO } from './create-reserva-dto';

@Injectable({
  providedIn: 'root',
})
export class GestionReservaApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  crearReserva(dto: CreateReservaDTO): Observable<{ id: number }> {
    return this.httpClient.post<{ id: number }>('/api/v1/reservas', dto);
  }
}
