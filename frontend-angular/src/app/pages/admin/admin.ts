import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemoAuthService } from '../../core/services/demo-auth.service';
import { DemoForoService } from '../../core/services/demo-foro.service';
import { EstadoModeracion } from '../../core/models/foro.models';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  readonly foro = inject(DemoForoService);
  readonly auth = inject(DemoAuthService);
  readonly mensaje = signal('');
  readonly temasOrdenados = computed(() => [...this.foro.temas()].sort((a, b) => b.id - a.id));
  readonly comentariosOrdenados = computed(() => [...this.foro.comentarios()].sort((a, b) => b.id - a.id));
  readonly temasOcultos = computed(() => this.foro.temas().filter(t => t.estado === 'OCULTO').length);
  readonly comentariosOcultos = computed(() => this.foro.comentarios().filter(c => c.estado === 'OCULTO').length);

  moderarTema(id: number, estado: EstadoModeracion): void {
    const resultado = this.foro.moderarTema(id, estado);
    this.mensaje.set(resultado.ok ? 'Estado del tema actualizado.' : resultado.mensaje);
  }

  moderarComentario(id: number, estado: EstadoModeracion): void {
    const resultado = this.foro.moderarComentario(id, estado);
    this.mensaje.set(resultado.ok ? 'Estado del comentario actualizado.' : resultado.mensaje);
  }
}
