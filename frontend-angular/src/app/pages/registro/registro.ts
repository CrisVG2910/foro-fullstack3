import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DemoAuthService } from '../../core/services/demo-auth.service';
import { coincidenPasswords, contieneEspecial, contieneMayuscula, contieneMinuscula, contieneNumero } from '../../shared/validators/password.validators';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  private readonly auth = inject(DemoAuthService);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly mostrarPassword = signal(false);
  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(150)] }),
    password: new FormControl('', { nonNullable: true, validators: [
      Validators.required, Validators.minLength(8), Validators.maxLength(32),
      contieneMayuscula, contieneMinuscula, contieneNumero, contieneEspecial
    ] }),
    confirmarPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    aceptaTerminos: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] })
  }, { validators: [coincidenPasswords] });

  registrar(): void {
    this.error.set('');
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const datos = this.form.getRawValue();
    const mensaje = this.auth.registrar(datos.nombre, datos.email, datos.password);
    if (mensaje) { this.error.set(mensaje); return; }
    void this.router.navigateByUrl('/perfil');
  }
}
