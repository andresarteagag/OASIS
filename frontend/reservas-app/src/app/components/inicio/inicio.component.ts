import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { mensajeError } from 'src/app/core/utils';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  credenciales = { correoInstitucional: '', contrasena: '' };
  cargando = false;

  constructor(private auth: AuthService, private usuarios: UsuarioService, private router: Router) {}

  login(): void {
    if (!this.credenciales.correoInstitucional || !this.credenciales.contrasena) {
      Swal.fire('Faltan datos', 'Escribe tu correo y tu contraseña', 'info');
      return;
    }
    this.cargando = true;
    this.usuarios.login(this.credenciales).pipe(finalize(() => this.cargando = false)).subscribe({
      next: sesion => {
        this.auth.guardar(sesion);
        // El rol lo decide el servidor, no el formulario.
        this.router.navigate([sesion.usuario.rol === 'ADMIN' ? '/admin-reservas' : '/reservas']);
      },
      error: e => Swal.fire('No pudimos ingresar', mensajeError(e, 'Verifica tus datos'), 'error')
    });
  }
}
