import { Routes } from '@angular/router';
import { requiereAdmin, requiereSesion } from './core/guards/acceso.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro').then(m => m.Registro) },
  { path: 'recuperar', loadComponent: () => import('./pages/recuperar/recuperar').then(m => m.Recuperar) },
  { path: 'perfil', canActivate: [requiereSesion], loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil) },
  { path: 'temas/:id/editar', canActivate: [requiereSesion], loadComponent: () => import('./pages/crear-tema/crear-tema').then(m => m.CrearTema) },
  { path: 'temas/:id', loadComponent: () => import('./pages/detalle-tema/detalle-tema').then(m => m.DetalleTema) },
  { path: 'temas', loadComponent: () => import('./pages/temas/temas').then(m => m.Temas) },
  { path: 'crear-tema', canActivate: [requiereSesion], loadComponent: () => import('./pages/crear-tema/crear-tema').then(m => m.CrearTema) },
  { path: 'admin', canActivate: [requiereAdmin], loadComponent: () => import('./pages/admin/admin').then(m => m.Admin) },
  { path: '**', redirectTo: '' }
];
