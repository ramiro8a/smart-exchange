import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

export interface TipoCambioResponse{
  id: number;
  tipo: number;
  estado: number;
  moneda: number;
  compra: number;
  venta: number;
  fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  path:string = '/api/tipo-cambio'
  constructor(private http: HttpClient) { }

  creaTipoCambio(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaTiposDeCambioCincoDias(moneda: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/${moneda}`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaTCActual(moneda: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/actual/${moneda}`).pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error:any) {
    console.warn(error)
    let errorMensaje = '';
    if(error.error instanceof ErrorEvent) {
      errorMensaje = error.error.mensaje;
    } else {
      console.error(error.error?.codigo+': '+error.error?.mensajeTec)
      errorMensaje = error.error?.mensaje
    }
    if(error.status==403 || error.status==401){
      errorMensaje =  'Acceso restringido'
    }
    return throwError(() => new Error(errorMensaje));
  }

}
