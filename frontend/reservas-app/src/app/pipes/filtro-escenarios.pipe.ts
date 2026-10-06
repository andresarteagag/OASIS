import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroEscenarios'
})
export class FiltroEscenariosPipe implements PipeTransform {
  transform(escenarios: any[], nombre: string, disponibilidad: string): any[] {
    let filtrados = escenarios;
    if (nombre) {
      filtrados = filtrados.filter(e => e.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
    if (disponibilidad === 'true') {
      filtrados = filtrados.filter(e => e.disponible);
    } else if (disponibilidad === 'false') {
      filtrados = filtrados.filter(e => !e.disponible);
    }
    return filtrados;
  }
}