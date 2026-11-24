import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.scss'
})
export class Recuperar {
  readonly enviado = signal(false);
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  recuperar(): void {
    this.enviado.set(false);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    // Demo: no envía correo real ni modifica contraseñas.
    this.enviado.set(true);
  }
}
