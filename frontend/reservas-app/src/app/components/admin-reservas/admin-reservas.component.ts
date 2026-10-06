import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { Escenario } from 'src/app/models/escenario.model';
import { Reserva, ReservaDto } from 'src/app/models/reserva.model';
import { Usuario } from 'src/app/models/usuario.model';
import { EscenarioService } from 'src/app/services/escenario.service';
import { ReservaService } from 'src/app/services/reserva.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HORAS, aviso, confirmar, esFutura, hoyISO, mensajeError } from 'src/app/core/utils';

@Component({
  selector: 'app-admin-reservas',
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css']
})
export class AdminReservasComponent implements OnInit {
  readonly horas = HORAS;
  readonly hoy = hoyISO();
  reservas: Reserva[] = [];
  usuarios: Usuario[] = [];
  escenarios: Escenario[] = [];
  filtro = '';
  cargando = true;
  mostrarForm = false;
  editandoId: string | null = null;
  form: ReservaDto = this.vacio();

  constructor(private reservasApi: ReservaService, private usuariosApi: UsuarioService, private escenariosApi: EscenarioService) {}

  ngOnInit(): void {
    forkJoin({ r: this.reservasApi.listar(), u: this.usuariosApi.listar(), e: this.escenariosApi.listar() }).subscribe({
      next: d => { this.reservas = d.r; this.usuarios = d.u; this.escenarios = d.e; this.cargando = false; },
      error: e => { this.cargando = false; Swal.fire('Error', mensajeError(e, 'No se pudieron cargar los datos'), 'error'); }
    });
  }

  get visibles(): Reserva[] {
    const q = this.filtro.trim().toLowerCase();
    return this.reservas
      .filter(r => !q || `${r.correoUsuario} ${r.nombreEscenario}`.toLowerCase().includes(q))
      .sort((a, b) => (b.fecha + b.horaInicio).localeCompare(a.fecha + a.horaInicio));
  }
  activa = (r: Reserva) => esFutura(r.fecha, r.horaInicio);

  nueva(): void { this.editandoId = null; this.form = this.vacio(); this.mostrarForm = true; }
  editar(r: Reserva): void {
    this.editandoId = r.id;
    this.form = { correoUsuario: r.correoUsuario, nombreEscenario: r.nombreEscenario, fecha: r.fecha, horaInicio: r.horaInicio.slice(0, 5) };
    this.mostrarForm = true;
  }
  descartar(): void { this.mostrarForm = false; this.editandoId = null; }

  guardar(): void {
    const op = this.editandoId ? this.reservasApi.actualizar(this.editandoId, this.form) : this.reservasApi.crear(this.form);
    op.subscribe({
      next: () => { aviso(this.editandoId ? 'Reserva actualizada' : 'Reserva creada'); this.descartar(); this.recargar(); },
      error: e => Swal.fire('No se pudo guardar', mensajeError(e, 'Revisa los datos'), 'error')
    });
  }

  async eliminar(r: Reserva): Promise<void> {
    if (!await confirmar('¿Eliminar reserva?', `${r.nombreEscenario}, ${r.fecha} ${r.horaInicio.slice(0, 5)} (${r.correoUsuario})`, 'Sí, eliminar')) return;
    this.reservasApi.eliminar(r.id).subscribe({
      next: () => { aviso('Reserva eliminada'); this.recargar(); },
      error: e => Swal.fire('No se pudo eliminar', mensajeError(e, 'Intenta de nuevo'), 'error')
    });
  }

  private recargar(): void { this.reservasApi.listar().subscribe(r => this.reservas = r); }
  private vacio(): ReservaDto { return { correoUsuario: '', nombreEscenario: '', fecha: '', horaInicio: '' }; }
}
