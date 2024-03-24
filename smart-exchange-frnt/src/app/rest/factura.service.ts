import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

export interface ComprobanteVentaResponse{
  id: number;
  nroFactura: number;
  facturaTicketSunat: string;
  facturaHash: string;
  nroComprobante: number;
  estado: string;
  codigoRespuesta: number;
  descripcion: string;
  envioSunat: boolean;
}

export interface ComprobanteResponse{
  base64: string;
  prefijo: string;
  tipo: string;
  nombreArchivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  path:string = '/api/comprobante-venta'
  constructor(private http: HttpClient) { }

  reEnviaFacturaSunat(id:number): Observable<ComprobanteVentaResponse> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/${id}`, {}).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaFactura(operacionId:number): Observable<ComprobanteVentaResponse> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/${operacionId}`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaArchivosSunat(id:number, tipo:number): Observable<ComprobanteResponse> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/${id}/${tipo}`).pipe(
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
