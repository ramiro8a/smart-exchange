import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../servicios/token.service';
import { UsuariosService } from '../rest/usuarios.service';
import { MatDialog } from '@angular/material/dialog';


const ROUTES_WITHOUT_AUTH = ['/login', '/registro','/refresh-token','/empresa-public','/auth','/auth/tipo-cambio'];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private restUsuarios: UsuariosService,
    private dialog: MatDialog,
    private router: Router
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!ROUTES_WITHOUT_AUTH.some(route => request.url.includes(route))) {
      if (this.tokenService.expirado()){
        if (this.tokenService.expiradoRefreshToken()) {
          this.dialog.closeAll();
          this.router.navigate(['/login']);
          return throwError(() => new HttpErrorResponse({ status: 401, error: 'Su sesión ha expirado' }));
        }else{
          this.restUsuarios.refreshToken(this.tokenService.getRefreshToken()).subscribe({
            next: (response:any) => {
              this.tokenService.setToken(response)
            },
            error: (error:any) => {
              this.dialog.closeAll();
              this.router.navigate(['/login']);
              return throwError(() => new HttpErrorResponse({ status: 401, error: 'Su sesión ha expirado' }));
            }
          });
        }
      } else {
        const token = this.tokenService.getToken();
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
