import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Escenario } from 'src/app/models/escenario.model';
import { Reserva } from 'src/app/models/reserva.model';
import { AuthService } from 'src/app/services/auth.service';
import { EscenarioService } from 'src/app/services/escenario.service';
import { ReservaService } from 'src/app/services/reserva.service';
import { HORAS, aFecha, aviso, confirmar, esFutura, fechaLarga, hoyISO, mensajeError } from 'src/app/core/utils';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  readonly horas = HORAS;
  readonly hoy = hoyISO();
  readonly fechaLarga = fechaLarga;

  escenarios: Escenario[] = [];
  reservas: Reserva[] = [];
  cargando = true;

  abierto: string | null = null;
  nueva = { fecha: '', hora: '' };
  editando = false;
  edicion = { escenario: '', fecha: '', hora: '' };

  constructor(private reservasApi: ReservaService, private escenariosApi: EscenarioService, private auth: AuthService) {}

  ngOnInit(): void {
    this.escenariosApi.listar().subscribe(e => this.escenarios = e);
    this.cargar();
  }

  /** Regla de negocio: una sola reserva activa (futura) por usuario. */
  get activa(): Reserva | undefined { return this.reservas.find(r => esFutura(r.fecha, r.horaInicio)); }
  get historial(): Reserva[] {
    return this.reservas.filter(r => !esFutura(r.fecha, r.horaInicio))
      .sort((a, b) => (b.fecha + b.horaInicio).localeCompare(a.fecha + a.horaInicio));
  }
  get disponibles(): Escenario[] { return this.escenarios.filter(e => e.disponible); }

  esPasada(fecha: string, hora: string): boolean { return !!fecha && aFecha(fecha, hora) <= new Date(); }
  toggle(e: Escenario): void { this.abierto = this.abierto === e.nombre ? null : e.nombre; }

  reservar(escenario: string): void {
    this.reservasApi.crear({ correoUsuario: this.correo, nombreEscenario: escenario, fecha: this.nueva.fecha, horaInicio: this.nueva.hora })
      .subscribe({
        next: () => { aviso('Reserva confirmada', escenario); this.nueva = { fecha: '', hora: '' }; this.abierto = null; this.cargar(); },
        error: e => Swal.fire('No se pudo reservar', mensajeError(e, 'Intenta de nuevo'), 'error')
      });
  }

  editar(r: Reserva): void {
    this.edicion = { escenario: r.nombreEscenario, fecha: r.fecha, hora: r.horaInicio.slice(0, 5) };
    this.editando = true;
  }

  guardar(r: Reserva): void {
    this.reservasApi.actualizar(r.id, { correoUsuario: r.correoUsuario, nombreEscenario: this.edicion.escenario,
                                        fecha: this.edicion.fecha, horaInicio: this.edicion.hora })
      .subscribe({
        next: () => { aviso('Reserva actualizada'); this.editando = false; this.cargar(); },
        error: e => Swal.fire('No se pudo actualizar', mensajeError(e, 'Intenta de nuevo'), 'error')
      });
  }

  async cancelar(r: Reserva): Promise<void> {
    if (!await confirmar('¿Cancelar tu reserva?', `${r.nombreEscenario}, ${r.fecha} a las ${r.horaInicio.slice(0, 5)}`, 'Sí, cancelar')) return;
    this.reservasApi.eliminar(r.id).subscribe({
      next: () => { aviso('Reserva cancelada'); this.editando = false; this.cargar(); },
      error: e => Swal.fire('No se pudo cancelar', mensajeError(e, 'Intenta de nuevo'), 'error')
    });
  }

  private get correo(): string { return this.auth.usuario?.correoInstitucional ?? ''; }

  private cargar(): void {
    this.reservasApi.porUsuario(this.correo).subscribe({
      next: r => { this.reservas = r; this.cargando = false; },
      error: () => this.cargando = false
    });
  }
}
