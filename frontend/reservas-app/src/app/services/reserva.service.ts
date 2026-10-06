import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Reserva, ReservaDto } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly api = `${environment.apiUrl}/reservas`;
  constructor(private http: HttpClient) {}

  listar(): Observable<Reserva[]> { return this.http.get<Reserva[]>(this.api); }
  porUsuario(correo: string): Observable<Reserva[]> { return this.http.get<Reserva[]>(`${this.api}/usuario/${encodeURIComponent(correo)}`); }
  crear(dto: ReservaDto): Observable<Reserva> { return this.http.post<Reserva>(`${this.api}/crear`, dto); }
  actualizar(id: string, dto: ReservaDto): Observable<Reserva> { return this.http.put<Reserva>(`${this.api}/${id}`, dto); }
  eliminar(id: string): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
