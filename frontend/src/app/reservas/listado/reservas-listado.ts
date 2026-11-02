import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { Template } from '../../template/template';
import { EstadosReservasEnum } from '../estados-reservas-enum';
import { ListReservaDTO } from './list-reserva-dto';
import { ReservasListadoApiClient } from './reservas-listado-api-client';

import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthStore, type UsuarioAutenticado } from '../../auth/auth-store';

import { MessageService } from 'primeng/api';
import { GestionReserva } from '../gestion/gestion-reserva';

import { InputNumber } from 'primeng/inputnumber';
import { ListMedicoDTO } from '../../medicos/listado/list-medico-dto';
import { MedicosListadoApiClient } from '../../medicos/listado/medicos-listado-api-client';

@Component({
  selector: 'app-reservas-listado',
  templateUrl: './reservas-listado.html',
  styleUrl: './reservas-listado.css',
  imports: [
    Template,
    TableModule,
    TagModule,
    DatePipe,
    CurrencyPipe,
    Select,
    FormsModule,
    DialogModule,
    Button,
    GestionReserva,
    InputNumber,
  ],
})
export class ReservasListado implements OnInit {
  private readonly apiClient: ReservasListadoApiClient = inject(ReservasListadoApiClient);

  private readonly authStore: AuthStore = inject(AuthStore);

  private readonly messageService: MessageService = inject(MessageService);

  private readonly medicosApiClient: MedicosListadoApiClient = inject(MedicosListadoApiClient);

  reservas = signal<ListReservaDTO[]>([]);

  estadoSeleccionado = signal<EstadosReservasEnum | null>(null);

  fechaSeleccionada = signal<string>('');

  mostrarGestion = signal<boolean>(false);

  usuario: UsuarioAutenticado | null = null;

  medicos = signal<ListMedicoDTO[]>([]);

  medicoSeleccionado = signal<ListMedicoDTO | null>(null);

  nuevoValorConsulta = signal<number | null>(null);

  mostrarGestionMedico = signal<boolean>(false);

  opcionesEstado = [
    { label: 'Todos', value: null },
    { label: 'Activo', value: EstadosReservasEnum.ACTIVO },
    { label: 'Atendido', value: EstadosReservasEnum.ATENDIDO },
    { label: 'Ausente', value: EstadosReservasEnum.AUSENTE },
    { label: 'Cancelado', value: EstadosReservasEnum.CANCELADO },
  ];

  ngOnInit(): void {
    this.usuario = this.authStore.obtenerUsuario();

    if (this.usuario?.rol !== 'MEDICO') {
      this.cargarReservas();
    }
  }

  esMedico(): boolean {
    return this.usuario?.rol === 'MEDICO';
  }

  esPaciente(): boolean {
    return this.usuario?.rol === 'PACIENTE';
  }

  esAdministrador(): boolean {
    return this.usuario?.rol === 'ADMINISTRADOR';
  }

  puedeCancelar(reserva: ListReservaDTO): boolean {
    return (
      (this.esPaciente() || this.esAdministrador()) && reserva.estado === EstadosReservasEnum.ACTIVO
    );
  }

  puedeGestionarTurno(reserva: ListReservaDTO): boolean {
    return this.esMedico() && reserva.estado === EstadosReservasEnum.ACTIVO;
  }

  cancelarReserva(reserva: ListReservaDTO): void {
    this.apiClient.cancelarReserva(reserva.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reserva cancelada correctamente',
        });

        if (this.estadoSeleccionado()) {
          this.filtrarPorEstado();
        } else {
          this.cargarReservas();
        }
      },

      error: (err) => {
        const mensaje = Array.isArray(err.error?.message)
          ? err.error.message.join('. ')
          : (err.error?.message ?? 'Ha ocurrido un error al cancelar la reserva');

        this.messageService.add({
          severity: 'error',
          summary: mensaje,
        });
      },
    });
  }

  marcarAtendido(reserva: ListReservaDTO): void {
    this.apiClient.marcarAtendido(reserva.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Turno marcado como atendido',
        });

        this.filtrarPorFecha();
      },

      error: (err) => {
        const mensaje = Array.isArray(err.error?.message)
          ? err.error.message.join('. ')
          : (err.error?.message ?? 'Ha ocurrido un error al actualizar el turno');

        this.messageService.add({
          severity: 'error',
          summary: mensaje,
        });
      },
    });
  }

  marcarAusente(reserva: ListReservaDTO): void {
    this.apiClient.marcarAusente(reserva.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Turno marcado como ausente',
        });

        this.filtrarPorFecha();
      },

      error: (err) => {
        const mensaje = Array.isArray(err.error?.message)
          ? err.error.message.join('. ')
          : (err.error?.message ?? 'Ha ocurrido un error al actualizar el turno');

        this.messageService.add({
          severity: 'error',
          summary: mensaje,
        });
      },
    });
  }

  cargarReservas(): void {
    this.apiClient.obtenerReservas().subscribe({
      next: (reservas) => {
        this.reservas.set(reservas);
      },
    });
  }

  filtrarPorEstado(): void {
    const estado = this.estadoSeleccionado();

    this.apiClient.obtenerReservas(estado ?? undefined).subscribe({
      next: (reservas) => {
        this.reservas.set(reservas);
      },
    });
  }

  filtrarPorFecha(): void {
    const fecha = this.fechaSeleccionada();

    if (!fecha) {
      this.reservas.set([]);
      return;
    }

    this.apiClient.obtenerReservas(undefined, fecha).subscribe({
      next: (reservas) => {
        this.reservas.set(reservas);
      },
    });
  }

  obtenerSeveridad(estado: EstadosReservasEnum): 'success' | 'info' | 'warn' | 'danger' {
    switch (estado) {
      case EstadosReservasEnum.ACTIVO:
        return 'success';

      case EstadosReservasEnum.ATENDIDO:
        return 'info';

      case EstadosReservasEnum.AUSENTE:
        return 'warn';

      case EstadosReservasEnum.CANCELADO:
        return 'danger';
    }
  }

  nuevaReserva(): void {
    this.mostrarGestion.set(true);
  }

  reservaCreada(): void {
    this.mostrarGestion.set(false);
    this.cargarReservas();
  }

  gestionarMedicos(): void {
    this.medicosApiClient.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.medicos.set(medicos);
        this.mostrarGestionMedico.set(true);
      },
    });
  }

  seleccionarMedico(medico: ListMedicoDTO): void {
    this.medicoSeleccionado.set(medico);
    this.nuevoValorConsulta.set(medico.valorConsulta);
  }

  actualizarValorConsulta(): void {
    const medico = this.medicoSeleccionado();
    const valorConsulta = this.nuevoValorConsulta();

    if (!medico || !valorConsulta || valorConsulta <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Debe seleccionar un médico e indicar un valor válido',
      });

      return;
    }

    this.medicosApiClient.actualizarValorConsulta(medico.id, valorConsulta).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Valor de consulta actualizado correctamente',
        });

        this.mostrarGestionMedico.set(false);
        this.medicoSeleccionado.set(null);
        this.nuevoValorConsulta.set(null);
      },

      error: (err) => {
        const mensaje = Array.isArray(err.error?.message)
          ? err.error.message.join('. ')
          : (err.error?.message ?? 'Ha ocurrido un error al actualizar el valor');

        this.messageService.add({
          severity: 'error',
          summary: mensaje,
        });
      },
    });
  }
}
