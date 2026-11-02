import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ListPacienteDTO } from './list-paciente-dto';

@Injectable({
  providedIn: 'root',
})
export class PacientesListadoApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  obtenerPacientes(): Observable<ListPacienteDTO[]> {
    return this.httpClient.get<ListPacienteDTO[]>('/api/v1/usuarios/pacientes');
  }
}
