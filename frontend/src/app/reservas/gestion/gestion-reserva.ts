import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';

import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { AuthStore } from '../../auth/auth-store';

import { ListMedicoDTO } from '../../medicos/listado/list-medico-dto';
import { MedicosListadoApiClient } from '../../medicos/listado/medicos-listado-api-client';
import { ListPacienteDTO } from '../../pacientes/listado/list-paciente-dto';
import { PacientesListadoApiClient } from '../../pacientes/listado/pacientes-listado-api-client';
import { CreateReservaDTO } from './create-reserva-dto';
import { GestionReservaApiClient } from './gestion-reserva-api-client';

@Component({
  selector: 'app-gestion-reserva',
  templateUrl: './gestion-reserva.html',
  styleUrl: './gestion-reserva.css',
  imports: [ReactiveFormsModule, Button, Select],
})
export class GestionReserva implements OnInit {
  private readonly apiClient: GestionReservaApiClient = inject(GestionReservaApiClient);

  private readonly messageService: MessageService = inject(MessageService);

  private readonly medicosApiClient: MedicosListadoApiClient = inject(MedicosListadoApiClient);

  private readonly authStore: AuthStore = inject(AuthStore);

  private readonly pacientesApiClient: PacientesListadoApiClient =
    inject(PacientesListadoApiClient);

  medicos = signal<ListMedicoDTO[]>([]);

  pacientes = signal<ListPacienteDTO[]>([]);

  reservaCreada = output<void>();

  form: FormGroup = new FormGroup({
    idPaciente: new FormControl(null),
    idMedico: new FormControl(null, [Validators.required, Validators.min(1)]),
    fechaHora: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.medicosApiClient.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.medicos.set(medicos);
      },
    });

    if (this.esAdministrador()) {
      this.pacientesApiClient.obtenerPacientes().subscribe({
        next: (pacientes) => {
          this.pacientes.set(pacientes);
        },
      });
    }
  }

  esAdministrador(): boolean {
    return this.authStore.obtenerUsuario()?.rol === 'ADMINISTRADOR';
  }

  guardar(): void {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Debe completar todos los campos',
      });

      return;
    }

    const dto: CreateReservaDTO = {
      idMedico: this.form.value.idMedico,
      fechaHora: this.form.value.fechaHora,
    };

    if (this.esAdministrador()) {
      dto.idPaciente = this.form.value.idPaciente;
    }

    if (this.esAdministrador() && !this.form.value.idPaciente) {
      this.messageService.add({
        severity: 'error',
        summary: 'Debe seleccionar un paciente',
      });

      return;
    }

    this.apiClient.crearReserva(dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reserva creada correctamente',
        });

        this.form.reset();

        this.reservaCreada.emit();
      },

      error: (err) => {
        const mensaje = err.error?.message ?? 'Ha ocurrido un error al crear la reserva';

        this.messageService.add({
          severity: 'error',
          summary: mensaje,
        });
      },
    });
  }
}
