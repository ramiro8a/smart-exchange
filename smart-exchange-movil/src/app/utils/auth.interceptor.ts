import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError, from, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UsuariosService } from '../services/usuarios.service';

const ROUTES_WITHOUT_AUTH = ['/login', '/registro','/refresh-token','empresa-public','/auth'];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private restUsuarios: UsuariosService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (ROUTES_WITHOUT_AUTH.some(route => request.url.includes(route))) {
      return next.handle(request);
    }

    return from(this.tokenService.expirado()).pipe(
      switchMap(expirado => {
        if (!expirado) {
          return from(this.tokenService.getToken()).pipe(
            switchMap(token => {
              request = request.clone({ 
                setHeaders: { 
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Headers': 'Content-Type',
                  'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,PATCH',
                  'ngrok-skip-browser-warning': 'valor',
                  'Authorization': `Bearer ${token}` 
                }});
              return next.handle(request);
            })
          );
        }

        return from(this.tokenService.expiradoRefreshToken()).pipe(
          switchMap(expiradoRefresh => {
            if (expiradoRefresh) {
              this.router.navigate(['/login']);
              return throwError(() => new Error('Su sesión ha expirado'));
            }
            
            return from(this.tokenService.getRefreshToken()).pipe(
              switchMap(refreshToken => this.restUsuarios.refreshToken(refreshToken)),
              switchMap(response => {
                this.tokenService.setToken(response);
                return from(this.tokenService.getToken()).pipe(
                  switchMap(token => {
                    request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
                    return next.handle(request);
                  })
                );
              }),
              catchError(error => {
                this.router.navigate(['/login']);
                return throwError(() => new Error('Error al refrescar el token'));
              })
            );
          })
        );
      }),
      catchError(error => {
        let errorMensaje = '';
        if (error.error instanceof ErrorEvent) {
          console.log('INTCTR1')
          errorMensaje = error.error.message;
        } else {
          console.log('INTCTR2')
          console.error(`${error.error?.codigo}: ${error.error?.mensaje}`);
          errorMensaje = error.error?.mensaje;
        }
        if (error.status == 403 || error.status == 401) {
          console.log('INTCTR3')
          errorMensaje = 'Acceso restringido';
        }
        return throwError(() => new Error(errorMensaje));
      })
    );
  }
}
