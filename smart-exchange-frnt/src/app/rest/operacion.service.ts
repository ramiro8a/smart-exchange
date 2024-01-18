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
      catchError(this.errorHandler)
    )
  }

  recuperaComprobante(operacionId: number, tipo:number): Observable<any>{
    return this.http.get<any>(`${environment.baseUrl}${this.path}/comprobante/${operacionId}/${tipo}`).pipe(
      catchError(this.errorHandler)
    )
  }

  reasignaOperador(operacionId:number,operadorId: number): Observable<number> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/reasigna/${operacionId}/${operadorId}`, {}).pipe(
      catchError(this.errorHandler)
    )
  }

  finalizaOperacion(operacionId:number,data: any): Observable<number> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/finaliza/${operacionId}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  actualizaComprobante(operacionId:number,data: any): Observable<number> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/${operacionId}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  accionesOperador(id:number,estado: number): Observable<number> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/acciones/${id}/${estado}`, {}).pipe(
      catchError(this.errorHandler)
    )
  }

  actualizaOperacion(operacionId:number,opcion:number,data: any): Observable<number> {
    return this.http.put<any>(`${environment.baseUrl}${this.path}/${operacionId}/${opcion}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  creaOperacion(data: any): Observable<number> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error:any) {
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
