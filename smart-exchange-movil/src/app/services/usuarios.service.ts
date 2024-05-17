import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { errorHandler } from '../utils/error-handler.util';

export interface ClienteResponse{
  id:number,
  fechaCreacion:Date,
  nombres:string,
  paterno:string,
  materno:string,
  tipoDocumento:number,
  nroDocumento:string,
  telefono:string,
  celular:string,
  estado:number,
  validado:boolean,
  usuarioId: number
}

export interface UsuarioResponse{
  id: number;
  creacion: string;
  actualizacion: string;
  version: number;
  estado: number;
  usuario: string;
  correo: string;
  celular: string;
  bloqueado: boolean;
  inicio: Date;
  fin: Date;
  roles: RolResponse[];
}

export interface RolResponse{
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  path:string = '/api/usuario'
  authPath:string = '/auth'

  constructor(private http: HttpClient) { }

  cuentasClienteAux(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.authPath}/cuentas-aux`, data).pipe(
      catchError(errorHandler)
    )
  }

  cambioPassworUsuario(data:any): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/cambio-password`, data).pipe(
      catchError(errorHandler)
    )
  }

  recuperaCliente(): Observable<ClienteResponse> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/cliente`).pipe(
      catchError(errorHandler)
    )
  }

  registraDatosPersonalesCliente(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}/cliente`, data).pipe(
      catchError(errorHandler)
    )
  }

  registraCliente(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.authPath}/registro`, data).pipe(
      catchError(errorHandler)
    )
  }

  login(data: any): Observable<any> {
    const credentials = btoa(data.username + ':' + data.password);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`
    });
    return this.http.post<any>(`${environment.baseUrl}${this.authPath}/login`, null, { headers: headers }).pipe(
      catchError(errorHandler)
    )
  }

  refreshToken(token:string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${environment.baseUrl}${this.path}/refresh-token`, null, { headers: headers }).pipe(
      catchError(errorHandler)
    )
  }

}
