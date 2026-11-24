import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoAuthService } from '../../core/services/demo-auth.service';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {
  readonly auth = inject(DemoAuthService);
  readonly usuario = this.auth.usuarioActual;
  readonly error = signal('');
  readonly exito = signal('');
  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(150)] })
  });

  constructor() {
    const actual = this.usuario();
    if (actual) this.form.patchValue({ nombre: actual.nombre, email: actual.email });
  }

  guardar(): void {
    this.error.set('');
    this.exito.set('');
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { nombre, email } = this.form.getRawValue();
    const mensaje = this.auth.actualizarPerfil(nombre, email);
    if (mensaje) { this.error.set(mensaje); return; }
    this.exito.set('Perfil actualizado correctamente en esta sesión de demostración.');
  }
}
