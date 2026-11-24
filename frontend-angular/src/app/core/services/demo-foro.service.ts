import { computed, inject, Injectable, signal } from '@angular/core';
import { DemoAuthService } from './demo-auth.service';
import {
  CategoriaForo, ComentarioForo, EstadoModeracion,
  NuevoTema, ResultadoOperacion, TemaForo
} from '../models/foro.models';

/**
 * Datos de demostración independientes de Oracle y Spring Boot.
 * Estado en memoria: al recargar la pestaña se restablecen los ejemplos.
 * La autorización real siempre debe implementarse en el backend.
 */
@Injectable({ providedIn: 'root' })
export class DemoForoService {
  private readonly auth = inject(DemoAuthService);

  readonly categorias = signal<CategoriaForo[]>([
    { id: 1, nombre: 'Tecnología', descripcion: 'Programación, software y tecnología.', icono: '💻' },
    { id: 2, nombre: 'Videojuegos', descripcion: 'Videojuegos, consolas y novedades.', icono: '🎮' },
    { id: 3, nombre: 'Música', descripcion: 'Álbumes, artistas e instrumentos.', icono: '🎵' },
    { id: 4, nombre: 'Cine', descripcion: 'Películas, series y entretenimiento.', icono: '🎬' },
    { id: 5, nombre: 'Consultas', descripcion: 'Preguntas y discusiones generales.', icono: '💬' }
  ]);

  private readonly _temas = signal<TemaForo[]>([
    { id: 1, titulo: '¿Qué framework JavaScript recomiendan para empezar?', contenido: 'Estoy aprendiendo desarrollo web y me gustaría conocer sus experiencias con Angular, React y Vue. ¿Con cuál empezarían y por qué?', categoriaId: 1, autorId: 2, autorNombre: 'Usuario Demo', fecha: '2026-11-20T13:00:00', estado: 'VISIBLE' },
    { id: 2, titulo: 'Juegos cooperativos para el fin de semana', contenido: 'Busco juegos cooperativos que podamos disfrutar entre amigos en PC. ¿Qué títulos recomiendan para cuatro personas?', categoriaId: 2, autorId: 2, autorNombre: 'Usuario Demo', fecha: '2026-11-19T17:30:00', estado: 'VISIBLE' },
    { id: 3, titulo: 'Álbumes indispensables para escuchar completos', contenido: 'Quiero descubrir discos que valgan la pena de principio a fin. Dejen sus recomendaciones y cuenten qué los hace especiales.', categoriaId: 3, autorId: 1, autorNombre: 'Administrador Demo', fecha: '2026-11-18T12:10:00', estado: 'VISIBLE' },
    { id: 4, titulo: 'Películas de ciencia ficción recomendadas', contenido: 'Me gustaría ver una película de ciencia ficción este fin de semana. Prefiero buenas historias y personajes antes que solo efectos especiales.', categoriaId: 4, autorId: 2, autorNombre: 'Usuario Demo', fecha: '2026-11-17T16:45:00', estado: 'VISIBLE' },
    { id: 5, titulo: 'Consejos para organizar un proyecto en equipo', contenido: '¿Cómo organizan los issues, ramas y revisiones de código cuando trabajan con otras personas?', categoriaId: 5, autorId: 1, autorNombre: 'Administrador Demo', fecha: '2026-11-16T10:00:00', estado: 'VISIBLE' },
    { id: 6, titulo: 'Experiencias utilizando Spring Boot y Oracle', contenido: 'Estoy desarrollando un backend con Spring Boot y Oracle. Me gustaría saber qué prácticas utilizan para organizar entidades, repositorios y servicios.', categoriaId: 1, autorId: 2, autorNombre: 'Usuario Demo', fecha: '2026-11-15T11:20:00', estado: 'VISIBLE' }
  ]);
  readonly temas = this._temas.asReadonly();
  readonly totalTemasVisibles = computed(() => this._temas().filter(t => t.estado === 'VISIBLE').length);

  private readonly _comentarios = signal<ComentarioForo[]>([
    { id: 1, temaId: 1, contenido: 'Angular es una buena alternativa si buscas una estructura completa.', autorId: 1, autorNombre: 'Administrador Demo', fecha: '2026-11-20T14:30:00', estado: 'VISIBLE' },
    { id: 2, temaId: 2, contenido: 'Overcooked es muy entretenido para jugar en grupo.', autorId: 1, autorNombre: 'Administrador Demo', fecha: '2026-11-19T18:05:00', estado: 'VISIBLE' },
    { id: 3, temaId: 3, contenido: 'Un buen disco merece escucharse completo y sin interrupciones.', autorId: 2, autorNombre: 'Usuario Demo', fecha: '2026-11-18T15:30:00', estado: 'VISIBLE' },
    { id: 4, temaId: 6, contenido: 'Separar Controller, Service y Repository facilita mucho las pruebas.', autorId: 1, autorNombre: 'Administrador Demo', fecha: '2026-11-16T09:40:00', estado: 'VISIBLE' }
  ]);
  readonly comentarios = this._comentarios.asReadonly();

  private siguienteTemaId = 7;
  private siguienteComentarioId = 5;

  nombreCategoria(id: number): string {
    return this.categorias().find(c => c.id === id)?.nombre ?? 'Sin categoría';
  }

  cantidadTemasPorCategoria(id: number): number {
    return this._temas().filter(t => t.categoriaId === id && t.estado === 'VISIBLE').length;
  }

  cantidadComentarios(temaId: number): number {
    return this._comentarios().filter(c => c.temaId === temaId && c.estado === 'VISIBLE').length;
  }

  temaPorId(id: number): TemaForo | undefined {
    return this._temas().find(t => t.id === id);
  }

  puedeEditarTema(tema: TemaForo): boolean {
    const usuario = this.auth.usuarioActual();
    return !!usuario && (usuario.id === tema.autorId || usuario.rol === 'ADMIN');
  }

  puedeEliminarComentario(comentario: ComentarioForo): boolean {
    const usuario = this.auth.usuarioActual();
    return !!usuario && (usuario.id === comentario.autorId || usuario.rol === 'ADMIN');
  }

  crearTema(datos: NuevoTema): number {
    const usuario = this.auth.usuarioActual();
    if (!usuario) throw new Error('Debes iniciar sesión para publicar.');
    this.validarTema(datos);
    const id = this.siguienteTemaId++;
    const nuevo: TemaForo = {
      id,
      titulo: datos.titulo.trim(), contenido: datos.contenido.trim(), categoriaId: datos.categoriaId,
      autorId: usuario.id, autorNombre: usuario.nombre,
      fecha: new Date().toISOString(), estado: 'VISIBLE'
    };
    this._temas.update(actuales => [nuevo, ...actuales]);
    return id;
  }

  editarTema(id: number, datos: NuevoTema): ResultadoOperacion {
    const tema = this.temaPorId(id);
    if (!tema) return { ok: false, mensaje: 'El tema no existe.' };
    if (!this.puedeEditarTema(tema)) return { ok: false, mensaje: 'No tienes permisos para editar este tema.' };
    if (tema.estado === 'OCULTO' && !this.auth.esAdmin()) return { ok: false, mensaje: 'El tema está moderado.' };
    try { this.validarTema(datos); }
    catch (e) { return { ok: false, mensaje: e instanceof Error ? e.message : 'Datos inválidos.' }; }
    this._temas.update(actuales => actuales.map(t => t.id === id
      ? { ...t, titulo: datos.titulo.trim(), contenido: datos.contenido.trim(), categoriaId: datos.categoriaId }
      : t));
    return { ok: true };
  }

  eliminarTema(id: number): ResultadoOperacion {
    const tema = this.temaPorId(id);
    if (!tema) return { ok: false, mensaje: 'El tema no existe.' };
    if (!this.puedeEditarTema(tema)) return { ok: false, mensaje: 'No tienes permiso para eliminarlo.' };
    this._temas.update(actuales => actuales.filter(t => t.id !== id));
    this._comentarios.update(actuales => actuales.filter(c => c.temaId !== id));
    return { ok: true };
  }

  agregarComentario(temaId: number, contenido: string): ResultadoOperacion {
    const usuario = this.auth.usuarioActual();
    if (!usuario) return { ok: false, mensaje: 'Debes iniciar sesión para comentar.' };
    const tema = this.temaPorId(temaId);
    if (!tema || tema.estado !== 'VISIBLE') return { ok: false, mensaje: 'El tema no está disponible.' };
    const texto = contenido.trim();
    if (texto.length < 3 || texto.length > 1000) {
      return { ok: false, mensaje: 'El comentario debe tener entre 3 y 1000 caracteres.' };
    }
    const nuevo: ComentarioForo = {
      id: this.siguienteComentarioId++, temaId, contenido: texto,
      autorId: usuario.id, autorNombre: usuario.nombre,
      fecha: new Date().toISOString(), estado: 'VISIBLE'
    };
    this._comentarios.update(actuales => [...actuales, nuevo]);
    return { ok: true };
  }

  eliminarComentario(id: number): ResultadoOperacion {
    const comentario = this._comentarios().find(c => c.id === id);
    if (!comentario) return { ok: false, mensaje: 'Comentario no encontrado.' };
    if (!this.puedeEliminarComentario(comentario)) return { ok: false, mensaje: 'Sin permiso.' };
    this._comentarios.update(actuales => actuales.filter(c => c.id !== id));
    return { ok: true };
  }

  moderarTema(id: number, estado: EstadoModeracion): ResultadoOperacion {
    if (!this.auth.esAdmin()) return { ok: false, mensaje: 'Solo ADMIN puede moderar.' };
    if (!this.temaPorId(id)) return { ok: false, mensaje: 'Tema no encontrado.' };
    this._temas.update(actuales => actuales.map(t => t.id === id ? { ...t, estado } : t));
    return { ok: true };
  }

  moderarComentario(id: number, estado: EstadoModeracion): ResultadoOperacion {
    if (!this.auth.esAdmin()) return { ok: false, mensaje: 'Solo ADMIN puede moderar.' };
    if (!this._comentarios().some(c => c.id === id)) return { ok: false, mensaje: 'Comentario no encontrado.' };
    this._comentarios.update(actuales => actuales.map(c => c.id === id ? { ...c, estado } : c));
    return { ok: true };
  }

  private validarTema(datos: NuevoTema): void {
    if (datos.titulo.trim().length < 5 || datos.titulo.trim().length > 120) {
      throw new Error('El título debe tener entre 5 y 120 caracteres.');
    }
    if (datos.contenido.trim().length < 15 || datos.contenido.trim().length > 5000) {
      throw new Error('El contenido debe tener entre 15 y 5000 caracteres.');
    }
    if (!this.categorias().some(c => c.id === datos.categoriaId)) {
      throw new Error('Selecciona una categoría válida.');
    }
  }
}
