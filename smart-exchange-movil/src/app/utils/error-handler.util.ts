import { throwError } from 'rxjs';

export function errorHandler(error: any) {
  console.warn(error);
  let errorMensaje = '';
  if (error.error instanceof ErrorEvent) {
    console.log('HADLR1')
    errorMensaje = error.error.message;
  } else {
    console.log('HADLR2')
    console.error(`${error.error?.codigo}: ${error.error?.mensaje}`);
    errorMensaje = error.error?.mensaje;
  }
  if (error.status == 403 || error.status == 401) {
    console.log('RAM3')
    errorMensaje = 'Acceso restringido';
  }
  if(error instanceof Error){
    return throwError(() => error);
  }
  return throwError(() => new Error(errorMensaje));
}
