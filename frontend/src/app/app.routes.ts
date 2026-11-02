import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ReservasListado } from './reservas/listado/reservas-listado';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'reservas', component: ReservasListado },
  { path: '**', redirectTo: 'login' },
];
