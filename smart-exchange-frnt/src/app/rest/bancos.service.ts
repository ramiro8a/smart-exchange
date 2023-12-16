import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BancosService {
  path:string = '/api/bancos'
  constructor(private http: HttpClient) { }

  recuperaCuentasRegistradas(monedaOrigen:number, monedaDestino:number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/cuentas-bancarias-registradas/${monedaOrigen}/${monedaDestino}`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaCuentasBancarias(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/cuenta-bancaria`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaDestinoTransferencia(banco: number| undefined, moneda:number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/destino-transferencia/${banco}/${moneda}`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaBancosActivos(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}`).pipe(
      catchError(this.errorHandler)
    )
  }

  creaCuentaBancaria(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}/crea-cuenta-bancaria`, data).pipe(
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
