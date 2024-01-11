import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../servicios/token.service';

export const DefaultGuard: CanActivateFn = (routem, state) =>{
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if(tokenService.getToken() && !tokenService.expirado()){
    return true
  }else{
    router.navigate(['/login'])
    return false
  }
}

export const AdminGuard: CanActivateFn = (routem, state) =>{
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if(tokenService.esAdmin()){
    return true
  }else{
    router.navigate(['/login'])
    return false
  }
}
export const ClienteGuard: CanActivateFn = (routem, state) =>{
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if(tokenService.esCliente()){
    return true
  }else{
    router.navigate(['/login'])
    return false
  }
}
export const OperadorGuard: CanActivateFn = (routem, state) =>{
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if(tokenService.esOperador()){
    return true
  }else{
    router.navigate(['/login'])
    return false
  }
}
export const GerenteGuard: CanActivateFn = (routem, state) =>{
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if(tokenService.esGerente()){
    return true
  }else{
    router.navigate(['/login'])
    return false
  }
}