import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DemoForoService } from '../../core/services/demo-foro.service';

@Component({
  selector: 'app-crear-tema',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './crear-tema.html',
  styleUrl: './crear-tema.scss'
})
export class CrearTema {
  readonly foro = inject(DemoForoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly idEdicion = Number(this.route.snapshot.paramMap.get('id')) || 0;
  readonly editando = this.idEdicion > 0;
  readonly error = signal('');
  readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5), Validators.maxLength(120)] }),
    categoriaId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    contenido: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(15), Validators.maxLength(5000)] })
  });

  constructor() {
    if (this.editando) {
      const tema = this.foro.temaPorId(this.idEdicion);
      if (!tema || !this.foro.puedeEditarTema(tema)) {
        void this.router.navigateByUrl('/temas');
        return;
      }
      this.form.patchValue({ titulo: tema.titulo, categoriaId: tema.categoriaId, contenido: tema.contenido });
    }
  }

  guardar(): void {
    this.error.set('');
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const datos = this.form.getRawValue();
    try {
      if (this.editando) {
        const resultado = this.foro.editarTema(this.idEdicion, datos);
        if (!resultado.ok) { this.error.set(resultado.mensaje); return; }
        void this.router.navigate(['/temas', this.idEdicion]);
      } else {
        const id = this.foro.crearTema(datos);
        void this.router.navigate(['/temas', id]);
      }
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se pudo guardar el tema.');
    }
  }
}
