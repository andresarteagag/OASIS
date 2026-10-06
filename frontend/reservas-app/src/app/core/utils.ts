import Swal from 'sweetalert2';

export const HORAS = Array.from({ length: 13 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

export const aFecha = (fecha: string, hora: string) => new Date(`${fecha}T${hora.slice(0, 5)}:00`);
export const esFutura = (fecha: string, hora: string) => aFecha(fecha, hora) > new Date();

/** Fecha local en YYYY-MM-DD (toISOString usa UTC y en Colombia adelanta el día después de las 7 p. m.). */
export function hoyISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export const fechaLarga = (fecha: string) =>
  new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

export function mensajeError(e: any, fallback: string): string {
  if (e?.status === 0) return 'No hay conexión con el servidor';
  return typeof e?.error === 'string' ? e.error : e?.error?.message || fallback;
}

export const aviso = (title: string, text = '') =>
  Swal.fire({ icon: 'success', title, text, timer: 1800, timerProgressBar: true, showConfirmButton: false });

export const confirmar = (title: string, text: string, boton: string) =>
  Swal.fire({ title, text, icon: 'warning', showCancelButton: true, confirmButtonText: boton,
              cancelButtonText: 'Volver', confirmButtonColor: '#B3261E' }).then(r => r.isConfirmed);
