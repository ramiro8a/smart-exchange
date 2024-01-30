import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { errorHandler } from '../utils/error-handler.util';

export interface TipoCambioResponse{
  id: number;
  tipo: number;
  estado: number;
  moneda: number;
  compra: number;
  venta: number;
  fecha: Date;
  fechaRegistro: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  path:string = '/api/tipo-cambio'
  constructor(private http: HttpClient) { }

  recuperaTCActual(moneda: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/actual/${moneda}`).pipe(
      catchError(errorHandler)
    )
  }

}
