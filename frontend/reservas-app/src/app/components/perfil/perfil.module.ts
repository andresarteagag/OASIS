import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil.component';
import { AuthGuard } from '../../guards/auth.guard';

@NgModule({
  declarations: [PerfilComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { 
        path: '', 
        component: PerfilComponent,
        canActivate: [AuthGuard],
        data: { title: 'Mi Perfil' } 
      }
    ])
  ],
  exports: [PerfilComponent]
})
export class PerfilModule { }