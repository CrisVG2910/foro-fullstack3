import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { DemoAuthService } from './core/services/demo-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly auth = inject(DemoAuthService);
  private readonly router = inject(Router);
  readonly menuAbierto = signal(false);

  cerrarMenu(): void { this.menuAbierto.set(false); }
  salir(): void {
    this.auth.cerrarSesion();
    this.cerrarMenu();
    void this.router.navigateByUrl('/');
  }
}
