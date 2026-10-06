import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sesion, Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly api = `${environment.apiUrl}/usuarios`;
  constructor(private http: HttpClient) {}

  login(c: { correoInstitucional: string; contrasena: string }): Observable<Sesion> { return this.http.post<Sesion>(`${this.api}/login`, c); }
  registrar(u: Usuario): Observable<Sesion> { return this.http.post<Sesion>(`${this.api}/registrar`, u); }
  logout(): Observable<void> { return this.http.post<void>(`${this.api}/logout`, {}); }

  listar(): Observable<Usuario[]> { return this.http.get<Usuario[]>(this.api); }
  crear(u: Usuario): Observable<Usuario> { return this.http.post<Usuario>(this.api, u); }
  actualizar(correo: string, u: Usuario): Observable<Usuario> { return this.http.put<Usuario>(`${this.api}/${encodeURIComponent(correo)}`, u); }
  eliminar(correo: string): Observable<void> { return this.http.delete<void>(`${this.api}/${encodeURIComponent(correo)}`); }
}
