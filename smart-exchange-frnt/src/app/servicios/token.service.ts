import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
TOKEN:string = 'token'

  constructor() { }

  public setToken(data:any):void{
    sessionStorage.setItem(this.TOKEN, data.token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN);
  }

  public esCliente():boolean{
    const roles = this.getUserRoles()
    if(roles){
      return roles.includes('CLIENTE')
    }else{
      return false
    }
  }

  public esOperador():boolean{
    const roles = this.getUserRoles()
    if(roles){
      return roles.includes('OPERADOR')
    }else{
      return false
    }
  }

  public esGerente():boolean{
    const roles = this.getUserRoles()
    if(roles){
      return roles.includes('GERENTE')
    }else{
      return false
    }
  }
  
  public esAdmin():boolean{
    const roles = this.getUserRoles()
    if(roles){
      return roles.includes('ADMIN')
    }else{
      return false
    }
  }

  public expirado(): boolean {
    const decodedToken = this.decodeToken();
    const now = Date.now().valueOf() / 1000;
    if (decodedToken && decodedToken.exp) {
      return decodedToken.exp < now;
    }
    return true;
  }

  private getUserRoles(): string[] | null {
    const decodedToken = this.decodeToken();
    if (decodedToken && decodedToken.roles) {
      return decodedToken.roles.map((role: any) => role.authority);
    }
    return null;
  }

  private decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
}
