import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { AuthStore } from '../auth/auth-store';

@Component({
  selector: 'app-template',
  templateUrl: './template.html',
  styleUrl: './template.css',
  imports: [Button],
})
export class Template {
  private readonly authStore: AuthStore = inject(AuthStore);

  cerrarSesion() {
    this.authStore.cerrarSesion();
  }
}
