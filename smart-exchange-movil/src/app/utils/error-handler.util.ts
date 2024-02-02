import { throwError } from 'rxjs';

export function errorHandler(error: any) {
  console.warn(error);
  let errorMensaje = '';
  if (error.error instanceof ErrorEvent) {
    console.log('RAM1')
    errorMensaje = error.error.message;
  } else {
    console.log('RAM2')
    console.error(`${error.error?.codigo}: ${error.error?.mensaje}`);
    errorMensaje = error.error?.mensaje;
  }
  if (error.status == 403 || error.status == 401) {
    console.log('RAM3')
    errorMensaje = 'Acceso restringido';
  }
  return throwError(() => new Error(errorMensaje));
}
