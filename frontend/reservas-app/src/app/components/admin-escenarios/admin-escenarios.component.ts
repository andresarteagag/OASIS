import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

interface Escenario {
  nombre: string;
  descripcion?: string;
  disponible: boolean;
}

@Component({
  selector: 'app-admin-escenarios',
  templateUrl: './admin-escenarios.component.html',
  styleUrls: ['./admin-escenarios.component.css']
})
export class AdminEscenariosComponent implements OnInit {
  escenarios: Escenario[] = [];
  nuevoEscenario: Escenario = { nombre: '', descripcion: '', disponible: true };
  editando: boolean = false;
  nombreOriginal: string = '';

  // Filtros
  filtroNombre: string = '';
  filtroDisponibilidad: string = '';

  // Modal de reservas por escenario
  mostrarModalReservas = false;
  reservasEscenario: any[] = [];
  escenarioSeleccionado: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarEscenarios();
  }

  cargarEscenarios() {
    this.http.get<Escenario[]>(environment.apiUrl + '/escenarios')
      .subscribe(data => this.escenarios = data);
  }

  crearEscenario() {
    this.http.post<Escenario>(environment.apiUrl + '/escenarios/crear', this.nuevoEscenario)
      .subscribe({
        next: (escenario) => {
          Swal.fire('Éxito', 'Escenario creado', 'success');
          this.cargarEscenarios();
          this.nuevoEscenario = { nombre: '', descripcion: '', disponible: true };
        },
        error: () => Swal.fire('Error', 'No se pudo crear', 'error')
      });
  }

  editarEscenario(escenario: Escenario) {
    this.nuevoEscenario = { ...escenario };
    this.nombreOriginal = escenario.nombre;
    this.editando = true;
  }

  guardarEdicion() {
    const body = {
      ...this.nuevoEscenario,
      nombreOriginal: this.nombreOriginal
    };
    this.http.put<Escenario>(environment.apiUrl + '/escenarios/editar', body)
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'Escenario editado', 'success');
          this.cargarEscenarios();
          this.nuevoEscenario = { nombre: '', descripcion: '', disponible: true };
          this.editando = false;
          this.nombreOriginal = '';
        },
        error: () => Swal.fire('Error', 'No se pudo editar', 'error')
      });
  }

  eliminarEscenario(nombre: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el escenario "${nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(environment.apiUrl + '/escenarios/eliminar/' + encodeURIComponent(nombre))
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'Escenario eliminado', 'success');
              this.cargarEscenarios();
            },
            error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
          });
      }
    });
  }

  cancelarEdicion() {
    this.nuevoEscenario = { nombre: '', descripcion: '', disponible: true };
    this.editando = false;
    this.nombreOriginal = '';
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  // ----------- VER RESERVAS POR ESCENARIO -----------
  verReservasEscenario(escenario: any) {
    this.escenarioSeleccionado = escenario;
    this.mostrarModalReservas = true;
    this.http.get<any[]>(`${environment.apiUrl}/reservas/escenario/${encodeURIComponent(escenario.nombre)}`)
      .subscribe(data => {
        this.reservasEscenario = data;
      });
  }

  cerrarModalReservas() {
    this.mostrarModalReservas = false;
    this.escenarioSeleccionado = null;
    this.reservasEscenario = [];
  }
}