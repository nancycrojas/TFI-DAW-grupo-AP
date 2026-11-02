import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ListMedicoDTO } from './list-medico-dto';

@Injectable({
  providedIn: 'root',
})
export class MedicosListadoApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  obtenerMedicos(): Observable<ListMedicoDTO[]> {
    return this.httpClient.get<ListMedicoDTO[]>('/api/v1/medicos');
  }

  actualizarValorConsulta(id: number, valorConsulta: number): Observable<void> {
    return this.httpClient.put<void>(`/api/v1/medicos/${id}`, { valorConsulta });
  }
}
