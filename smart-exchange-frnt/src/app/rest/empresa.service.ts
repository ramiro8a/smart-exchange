import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

export interface Empresa {
  id: number;
  razonSocial: string;
  ruc: string;
  whatsapp: string;
  dias: Dia[];
  notifica: boolean;
  emailNotificacion: string;
}

export interface Dia {
  id: number;
  nombre: string;
  laboral: boolean;
  horario: Horario;
  hayCambio?: boolean
}

export interface Horario {
  id: number;
  desde: string;
  hasta: string;
  tDesde?: Time;
  tHasta?: Time;
}
export interface Time {
  hora: string;
  minuto: string;
};

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  path:string = '/api/empresa'

  constructor(private http: HttpClient) { }

  recuperaEmpresa(): Observable<Empresa>{
    return this.http.get<any>(`${environment.baseUrl}${this.path}`).pipe(
      catchError(this.errorHandler)
    )
  }

  actualizaEmpresa(empresaId:number,data: Empresa): Observable<Empresa> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/${empresaId}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  actualizaDia(diaId:number,data: Dia): Observable<Empresa> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/dia/${diaId}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error:any) {
    let errorMensaje = '';
    if(error.error instanceof ErrorEvent) {
      errorMensaje = error.error.mensaje;
    } else {
      console.error(error)
      errorMensaje = error.error?.mensaje
    }
    if(error.status==403 || error.status==401){
      errorMensaje =  'Acceso restringido'
    }
    return throwError(() => new Error(errorMensaje));
  }
}
