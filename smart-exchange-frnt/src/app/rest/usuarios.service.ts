import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Empresa } from './empresa.service';

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

  recuperaEmpresa(): Observable<Empresa>{
    return this.http.get<any>(`${environment.baseUrl}${this.authPath}/empresa-public`).pipe(
      catchError(this.errorHandler)
    )
  }

  cambioPassworUsuario(data:any): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/cambio-password`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  bloqueoUsuario(id:number, bloqueado: boolean): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/bloqueo/${id}/${bloqueado}`, {}).pipe(
      catchError(this.errorHandler)
    )
  }

  resetPasswordCliente(data:any): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.authPath}/reset-pass`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  cuentasClienteAux(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.authPath}/cuentas-aux`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaCliente(): Observable<ClienteResponse> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/cliente`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaOperadores(): Observable<UsuarioResponse[]> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/operadores`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaUsuarioPorId(id:number): Observable<UsuarioResponse> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/${id}`).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaUsuarios(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}`).pipe(
      catchError(this.errorHandler)
    )
  }

  registraDatosPersonalesCliente(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}/cliente`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  recuperaClientes(tipo:number, valor: string, pagina:number, tamano:number): Observable<ClienteResponse[]> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/cliente/${pagina}/${tamano}/${tipo}/${valor}`).pipe(
      catchError(this.errorHandler)
    )
  }
  cambiaEstado(id:number): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/cliente/estado/${id}`, null).pipe(
      catchError(this.errorHandler)
    )
  }
  validaCliente(id:number): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/cliente/valida/${id}`, null).pipe(
      catchError(this.errorHandler)
    )
  }

  registraCliente(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.authPath}/registro`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  editaUsuario(id:number, data: any): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${this.path}/edita/${id}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  creaUsuario(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}`, data).pipe(
      catchError(this.errorHandler)
    )
  }

  login(data: any): Observable<any> {
    const credentials = btoa(data.username + ':' + data.password);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`
    });
    return this.http.post<any>(`${environment.baseUrl}${this.authPath}/login`, null, { headers: headers }).pipe(
      catchError(this.errorHandler)
    )
  }

  refreshToken(token:string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${environment.baseUrl}${this.path}/refresh-token`, null, { headers: headers }).pipe(
      catchError(this.errorHandler)
    )
  }

  confirmaCorreo(token: string): Observable<any> {
    console.warn(`${environment.baseUrl}${this.authPath}/confirmer/${token}`)
    return this.http.get<any>(`${environment.baseUrl}${this.authPath}/confirmer/${token}`).pipe(
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
