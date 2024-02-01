import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { errorHandler } from '../utils/error-handler.util';

export interface Banco{
  id: number;
  nombre: string;
  estado: number;
  activo?: boolean;
}

export interface CuentaBancariaResponse{
  id: number;
  tipoCuenta: number;
  moneda: number;
  banco: number;
  bancoNombre: string;
  numeroCuenta: string;
  nombre: string;
  estado: number;
  ruc: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BancosService {
  path:string = '/api/bancos'
  constructor(private http: HttpClient) { }

  habilitaDeshabilitaCuenta(cuentaId:number, estado: boolean): Observable<CuentaBancariaResponse[]> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/cuentas/${cuentaId}/${estado}`, {}).pipe(
      catchError(errorHandler)
    )
  }

  recuperaCuentasRegistradas(monedaOrigen:number, monedaDestino:number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/cuentas-bancarias-registradas/${monedaOrigen}/${monedaDestino}`).pipe(
      catchError(errorHandler)
    )
  }

  recuperaCuentasBancarias(): Observable<CuentaBancariaResponse[]> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/cuenta-bancaria`).pipe(
      catchError(errorHandler)
    )
  }

  recuperaDestinoTransferencia(banco: number| undefined, moneda:number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/destino-transferencia/${banco}/${moneda}`).pipe(
      catchError(errorHandler)
    )
  }

  recuperaBancosActivos(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}`).pipe(
      catchError(errorHandler)
    )
  }

  recuperaBancosTodos(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/todos`).pipe(
      catchError(errorHandler)
    )
  }

  creaCuentaBancaria(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}/crea-cuenta-bancaria`, data).pipe(
      catchError(errorHandler)
    )
  }

  editaCuentaBancaria(id:number, data: CuentaBancariaResponse): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/edita-cuenta-bancaria/${id}`, data).pipe(
      catchError(errorHandler)
    )
  }

}
