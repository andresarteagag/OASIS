import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth.interceptor';
import { AdminReservasComponent } from './components/admin-reservas/admin-reservas.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminEscenariosComponent } from './components/admin-escenarios/admin-escenarios.component';
import { FiltroEscenariosPipe } from './pipes/filtro-escenarios.pipe';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
// import { ReservasComponent } from './components/reservas/reservas.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminEscenariosComponent,
    FiltroEscenariosPipe,
    AdminUsuariosComponent,
    AdminReservasComponent,
    // ReservasComponent, // Si lo necesitas, descomenta esta línea
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }