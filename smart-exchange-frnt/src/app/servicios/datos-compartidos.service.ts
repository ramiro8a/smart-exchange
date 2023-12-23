import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject } from 'rxjs'

export interface Notificacion{
  descripcion: string;
  metodo: string;
  valor: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatosCompartidosService {

  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$ = this.notificacionesSubject.asObservable();

  actualizarNotificaciones(nuevasNotificaciones: Notificacion[]) {
    this.notificacionesSubject.next(nuevasNotificaciones);
  }
  agregarNotificacion(nuevaNotificacion: Notificacion) {
    const notificacionesActuales = this.notificacionesSubject.value;
    const notificacionesActualizadas = [...notificacionesActuales, nuevaNotificacion];
    this.notificacionesSubject.next(notificacionesActualizadas);
  }
  eliminarNotificacionPorValor(valor: string) {
    const notificacionesActuales = this.notificacionesSubject.value;
    const notificacionesFiltradas = notificacionesActuales.filter(notificacion => notificacion.valor !== valor);
    this.notificacionesSubject.next(notificacionesFiltradas);
  }

}


