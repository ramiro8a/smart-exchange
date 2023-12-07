import { Injectable } from '@angular/core';
import { Observable, Subject,BehaviorSubject } from 'rxjs'

export interface Notificacion{
  descripcion: string;
  metodo: string;
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

}


