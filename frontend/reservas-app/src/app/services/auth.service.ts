import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Sesion, Usuario } from '../models/usuario.model';

const KEY = 'oasis.sesion';

/** Estado de sesión (sin HttpClient, para que el interceptor pueda inyectarlo sin dependencia circular). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly estado$ = new BehaviorSubject<Sesion | null>(this.leer());
  readonly sesion$ = this.estado$.asObservable();

  constructor(private router: Router) {}

  get token(): string | null { return this.estado$.value?.token ?? null; }
  get usuario(): Usuario | null { return this.estado$.value?.usuario ?? null; }
  get esAdmin(): boolean { return this.usuario?.rol === 'ADMIN'; }
  isLoggedIn(): boolean { return !!this.estado$.value; }

  guardar(sesion: Sesion): void {
    try { localStorage.setItem(KEY, JSON.stringify(sesion)); } catch { /* almacenamiento no disponible */ }
    this.estado$.next(sesion);
  }

  cerrar(redirigir = true): void {
    try { localStorage.removeItem(KEY); } catch { /* noop */ }
    this.estado$.next(null);
    if (redirigir) this.router.navigate(['/inicio']);
  }

  private leer(): Sesion | null {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
  }
}
