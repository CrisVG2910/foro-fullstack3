import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DemoAuthService } from '../../core/services/demo-auth.service';
import { DemoForoService } from '../../core/services/demo-foro.service';

@Component({
  selector: 'app-detalle-tema',
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './detalle-tema.html',
  styleUrl: './detalle-tema.scss'
})
export class DetalleTema {
  readonly foro = inject(DemoForoService);
  readonly auth = inject(DemoAuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly tema = computed(() => this.foro.temaPorId(this.id));
  readonly comentarios = computed(() => this.foro.comentarios()
    .filter(c => c.temaId === this.id && (c.estado === 'VISIBLE' || this.auth.esAdmin()))
    .sort((a, b) => a.fecha.localeCompare(b.fecha)));
  readonly error = signal('');
  readonly exito = signal('');
  readonly nuevoComentario = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]
  });

  publicarComentario(): void {
    this.error.set(''); this.exito.set('');
    if (this.nuevoComentario.invalid) { this.nuevoComentario.markAsTouched(); return; }
    const resultado = this.foro.agregarComentario(this.id, this.nuevoComentario.value);
    if (!resultado.ok) { this.error.set(resultado.mensaje); return; }
    this.nuevoComentario.reset('');
    this.exito.set('Comentario publicado correctamente.');
  }

  eliminarTema(): void {
    if (!window.confirm('¿Eliminar el tema y todos sus comentarios?')) return;
    const resultado = this.foro.eliminarTema(this.id);
    if (!resultado.ok) { this.error.set(resultado.mensaje); return; }
    void this.router.navigateByUrl('/temas');
  }

  eliminarComentario(id: number): void {
    if (!window.confirm('¿Eliminar este comentario?')) return;
    const resultado = this.foro.eliminarComentario(id);
    if (!resultado.ok) this.error.set(resultado.mensaje);
  }
}
