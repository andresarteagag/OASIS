import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, finalize } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UsuarioService } from './services/usuario.service';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent {
  rutaPublica = true;

  constructor(public auth: AuthService, private usuarios: UsuarioService, router: Router) {
    router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.rutaPublica = ['/inicio', '/registro'].some(p => e.urlAfterRedirects.startsWith(p)));
  }

  salir(): void {
    this.usuarios.logout().pipe(finalize(() => this.auth.cerrar())).subscribe({ error: () => {} });
  }
}
