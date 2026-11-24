import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DemoAuthService } from '../../core/services/demo-auth.service';
import { DemoForoService } from '../../core/services/demo-foro.service';

@Component({
  selector: 'app-temas',
  imports: [RouterLink, DatePipe],
  templateUrl: './temas.html',
  styleUrl: './temas.scss'
})
export class Temas {
  readonly foro = inject(DemoForoService);
  readonly auth = inject(DemoAuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly busqueda = signal('');
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  readonly categoriaSeleccionada = computed(() => Number(this.params().get('categoria')) || 0);
  readonly filtrados = computed(() => {
    const texto = this.busqueda().trim().toLocaleLowerCase('es');
    const categoriaId = this.categoriaSeleccionada();
    return this.foro.temas()
      .filter(t => t.estado === 'VISIBLE')
      .filter(t => !categoriaId || t.categoriaId === categoriaId)
      .filter(t => !texto || `${t.titulo} ${t.contenido} ${t.autorNombre}`.toLocaleLowerCase('es').includes(texto))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  });

  cambiarCategoria(valor: string): void {
    const id = Number(valor);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoria: id || null },
      queryParamsHandling: 'merge'
    });
  }
}
