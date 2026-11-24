export interface CategoriaForo {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

export type EstadoModeracion = 'VISIBLE' | 'OCULTO';

export interface TemaForo {
  id: number;
  titulo: string;
  contenido: string;
  categoriaId: number;
  autorId: number;
  autorNombre: string;
  fecha: string;
  estado: EstadoModeracion;
}

export interface ComentarioForo {
  id: number;
  temaId: number;
  contenido: string;
  autorId: number;
  autorNombre: string;
  fecha: string;
  estado: EstadoModeracion;
}

export interface NuevoTema {
  titulo: string;
  contenido: string;
  categoriaId: number;
}

export type ResultadoOperacion = { ok: true } | { ok: false; mensaje: string };
