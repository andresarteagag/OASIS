export interface Reserva {
  id: string;
  correoUsuario: string;
  nombreEscenario: string;
  fecha: string;       // YYYY-MM-DD
  horaInicio: string;  // HH:mm o HH:mm:ss
}

export type ReservaDto = Omit<Reserva, 'id'>;
