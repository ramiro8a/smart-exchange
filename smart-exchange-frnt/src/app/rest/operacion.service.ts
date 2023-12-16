import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperacionService {
  path:string = '/api/operacion'

  constructor(private http: HttpClient) { }

  registraTransferencia(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${this.path}`, data).pipe(
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
