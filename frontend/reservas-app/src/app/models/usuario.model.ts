export type Rol = 'ADMIN' | 'USUARIO';

export interface Usuario {
  nombre: string;
  apellidos: string;
  cedula: string;
  correoInstitucional: string;
  contrasena?: string;
  rol?: Rol;
}

export interface Sesion {
  token: string;
  usuario: Usuario;
}
