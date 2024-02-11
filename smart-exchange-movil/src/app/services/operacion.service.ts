import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ClienteResponse } from './usuarios.service';
import { CuentaBancariaResponse } from './bancos.service';
import { TipoCambioResponse } from './tipo-cambio.service';
import { UsuarioResponse } from './usuarios.service';
import { HttpParams } from '@angular/common/http';
import { errorHandler } from '../utils/error-handler.util';

export interface PaginaOperacionResponse {
  content: OperacionResponse[]; //cotenido
  empty: boolean;//vacio
  first: boolean;//primero
  last: boolean; //ultimo
  number: number;///pagina actual
  numberOfElements: number; ///mostrando cantidad
  size: number;//cantidad de elementos pedidos
  totalElements: number;///total de filas
  totalPages: number;///total de paginas
}

export interface OperacionResponse{
  id: number;
  fechaCreacion: Date;
  version: number;
  estado: number;
  tipoTransferencia: number;
  monto: number;
  montoFinal: number;
  codigoTransferencia: string;
  ticket: string;
  cliente: ClienteResponse;
  cuentaOrigen: CuentaBancariaResponse;
  cuentaDestino: CuentaBancariaResponse;
  cuentaTransferencia: CuentaBancariaResponse;
  tipoCambio: TipoCambioResponse;
  operador: UsuarioResponse;
  codigoTransferenciaEmpresa: string;
}

@Injectable({
  providedIn: 'root'
})
export class OperacionService {
  path:string = '/api/operacion'

  constructor(private http: HttpClient) { }

  recuperaOperacionesPaginado(pagina:number, tamano: number, criterios: any): Observable<PaginaOperacionResponse>{
    let params = new HttpParams();
    Object.keys(criterios).forEach(key => {
        if (criterios[key] !== null) {
            params = params.set(key, criterios[key]);
        }
    });
    return this.http.get<any>(`${environment.baseUrl}${this.path}/${pagina}/${tamano}`,{ params: params }).pipe(
      catchError(errorHandler)
    )
  }

  recuperaComprobante(operacionId: number, tipo:number): Observable<any>{
    return this.http.get<any>(`${environment.baseUrl}${this.path}/comprobante/${operacionId}/${tipo}`).pipe(
      catchError(errorHandler)
    )
  }

  actualizaComprobante(operacionId:number,data: any): Observable<number> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/${operacionId}`, data).pipe(
      catchError(errorHandler)
    )
  }

  actualizaOperacion(operacionId:number,opcion:number,data: any): Observable<number> {
    return this.http.put<any>(`${environment.baseUrl}${this.path}/${operacionId}/${opcion}`, data).pipe(
      catchError(errorHandler)
    )
  }

  creaOperacion(data: any): Observable<number> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}`, data).pipe(
      catchError(errorHandler)
    )
  }

}
