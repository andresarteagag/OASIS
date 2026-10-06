import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { aviso, confirmar, mensajeError } from 'src/app/core/utils';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = true;
  mostrarForm = false;
  editando: string | null = null;   // correo del usuario en edición
  form: Usuario = this.vacio();

  constructor(private api: UsuarioService) {}

  ngOnInit(): void { this.cargar(); }

  nuevo(): void { this.editando = null; this.form = this.vacio(); this.mostrarForm = true; }
  editar(u: Usuario): void { this.editando = u.correoInstitucional; this.form = { ...u, contrasena: '' }; this.mostrarForm = true; }
  descartar(): void { this.mostrarForm = false; this.editando = null; }

  guardar(): void {
    const op = this.editando ? this.api.actualizar(this.editando, this.form) : this.api.crear(this.form);
    op.subscribe({
      next: () => { aviso(this.editando ? 'Usuario actualizado' : 'Usuario creado'); this.descartar(); this.cargar(); },
      error: e => Swal.fire('No se pudo guardar', mensajeError(e, 'Revisa los datos'), 'error')
    });
  }

  async eliminar(u: Usuario): Promise<void> {
    if (!await confirmar('¿Eliminar usuario?', `Se borrarán también las reservas de ${u.correoInstitucional}.`, 'Sí, eliminar')) return;
    this.api.eliminar(u.correoInstitucional).subscribe({
      next: () => { aviso('Usuario eliminado'); this.cargar(); },
      error: e => Swal.fire('No se pudo eliminar', mensajeError(e, 'Intenta de nuevo'), 'error')
    });
  }

  private cargar(): void {
    this.api.listar().subscribe({ next: u => { this.usuarios = u; this.cargando = false; }, error: () => this.cargando = false });
  }
  private vacio(): Usuario { return { nombre: '', apellidos: '', cedula: '', correoInstitucional: '', contrasena: '' }; }
}
