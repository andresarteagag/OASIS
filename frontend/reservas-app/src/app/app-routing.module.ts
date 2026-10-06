import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminEscenariosComponent } from './components/admin-escenarios/admin-escenarios.component';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component'; // Importa el nuevo componente
import { AdminReservasComponent } from './components/admin-reservas/admin-reservas.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'inicio', 
    pathMatch: 'full' 
  },
  { 
    path: 'inicio', 
    loadChildren: () => import('./components/inicio/inicio.module').then(m => m.InicioModule),
    data: { hideHeader: true } 
  },
  { 
    path: 'registro', 
    loadChildren: () => import('./components/registro/registro.module').then(m => m.RegistroModule) 
  },
  { 
    path: 'perfil', 
    loadChildren: () => import('./components/perfil/perfil.module').then(m => m.PerfilModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'reservas',
    loadChildren: () => import('./components/reservas/reservas.module').then(m => m.ReservasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-escenarios',
    component: AdminEscenariosComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin-usuarios',
    component: AdminUsuariosComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin-reservas',
    component: AdminReservasComponent,
    canActivate: [AdminGuard]
  },
  { 
    path: '**', 
    redirectTo: 'inicio' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }