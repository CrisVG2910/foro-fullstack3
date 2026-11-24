import { computed, Injectable, signal } from '@angular/core';

export type Rol = 'USER' | 'ADMIN';

export interface UsuarioDemo {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

interface CuentaDemo extends UsuarioDemo {
  password: string;
}

/** Servicio exclusivamente demostrativo. No autentica contra un servidor. */
@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  // Las contraseñas de prueba solo existen en memoria; no se guardan en el navegador.
  private cuentas: CuentaDemo[] = [
    { id: 1, nombre: 'Administrador Demo', email: 'admin@foro.cl', password: 'Admin123!', rol: 'ADMIN' },
    { id: 2, nombre: 'Usuario Demo', email: 'usuario@foro.cl', password: 'Usuario123!', rol: 'USER' }
  ];
  private proximoId = 3;
  private readonly _usuarioActual = signal<UsuarioDemo | null>(null);
  readonly usuarioActual = this._usuarioActual.asReadonly();
  readonly esAdmin = computed(() => this._usuarioActual()?.rol === 'ADMIN');

  iniciarSesion(email: string, password: string): string | null {
    const cuenta = this.cuentas.find(c => c.email === email.trim().toLowerCase() && c.password === password);
    if (!cuenta) return 'Correo o contraseña incorrectos.';
    this._usuarioActual.set(this.publicar(cuenta));
    return null;
  }

  registrar(nombre: string, email: string, password: string): string | null {
    const correo = email.trim().toLowerCase();
    if (this.cuentas.some(c => c.email === correo)) return 'Este correo ya está registrado.';
    const cuenta: CuentaDemo = {
      id: this.proximoId++, nombre: nombre.trim(), email: correo, password, rol: 'USER'
    };
    this.cuentas.push(cuenta);
    this._usuarioActual.set(this.publicar(cuenta));
    return null;
  }

  actualizarPerfil(nombre: string, email: string): string | null {
    const actual = this._usuarioActual();
    if (!actual) return 'Debes iniciar sesión.';
    const correo = email.trim().toLowerCase();
    if (this.cuentas.some(c => c.id !== actual.id && c.email === correo)) {
      return 'El correo ya pertenece a otra cuenta.';
    }
    const cuenta = this.cuentas.find(c => c.id === actual.id);
    if (!cuenta) return 'La cuenta ya no está disponible.';
    cuenta.nombre = nombre.trim();
    cuenta.email = correo;
    this._usuarioActual.set(this.publicar(cuenta));
    return null;
  }

  cerrarSesion(): void { this._usuarioActual.set(null); }

  private publicar({ id, nombre, email, rol }: CuentaDemo): UsuarioDemo {
    return { id, nombre, email, rol };
  }
}
