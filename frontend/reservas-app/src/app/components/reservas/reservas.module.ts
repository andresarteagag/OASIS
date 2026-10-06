import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservasComponent } from './reservas.component';

@NgModule({
  declarations: [ReservasComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReservasRoutingModule
  ]
})
export class ReservasModule { }
