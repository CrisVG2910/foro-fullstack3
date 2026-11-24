import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const contieneMayuscula: ValidatorFn = control =>
  /[A-Z]/.test(String(control.value ?? '')) ? null : { mayuscula: true };
export const contieneMinuscula: ValidatorFn = control =>
  /[a-z]/.test(String(control.value ?? '')) ? null : { minuscula: true };
export const contieneNumero: ValidatorFn = control =>
  /\d/.test(String(control.value ?? '')) ? null : { numero: true };
export const contieneEspecial: ValidatorFn = control =>
  /[^A-Za-z0-9\s]/.test(String(control.value ?? '')) ? null : { especial: true };

export const coincidenPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmacion = group.get('confirmarPassword')?.value;
  return password === confirmacion ? null : { passwordsDistintas: true };
};
