import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  path:string = '/api/usuario'
  authPath:string = '/auth'

  constructor(private http: HttpClient) { }

  recuperaUsuarios(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}`).pipe(
      catchError(this.errorHandler)
    )
  }

  registraCliente(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.authPath}/registro`, data).pipe(
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
