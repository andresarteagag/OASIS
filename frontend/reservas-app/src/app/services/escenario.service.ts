import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Escenario } from '../models/escenario.model';

@Injectable({ providedIn: 'root' })
export class EscenarioService {
  constructor(private http: HttpClient) {}
  listar(): Observable<Escenario[]> { return this.http.get<Escenario[]>(`${environment.apiUrl}/escenarios`); }
}
