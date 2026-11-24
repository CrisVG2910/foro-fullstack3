import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemoForoService } from '../../core/services/demo-foro.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, DatePipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {
  readonly foro = inject(DemoForoService);
  readonly ultimosTemas = computed(() => this.foro.temas()
    .filter(t => t.estado === 'VISIBLE')
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 3));
}
