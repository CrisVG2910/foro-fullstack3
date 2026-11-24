import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DemoAuthService } from '../services/demo-auth.service';

// Solo control de navegación de la demo. No sustituye autorización del backend.
export const requiereSesion: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  return auth.usuarioActual() ? true : inject(Router).createUrlTree(['/login']);
};

export const requiereAdmin: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  const router = inject(Router);
  if (!auth.usuarioActual()) return router.createUrlTree(['/login']);
  return auth.esAdmin() ? true : router.createUrlTree(['/']);
};
