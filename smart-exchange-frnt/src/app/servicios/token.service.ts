import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
TOKEN:string = 'token'
REFRESH_TOKEN:string = 'refreshToken'

  constructor() { }

  public setToken(data:any):void{
    sessionStorage.setItem(this.TOKEN, data.token);
    sessionStorage.setItem(this.REFRESH_TOKEN, data.refreshToken);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN);
  }

  public getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN);
  }
  
  public removeToken(): void {
    sessionStorage.removeItem(this.TOKEN);
    sessionStorage.removeItem(this.REFRESH_TOKEN);
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

  public recuperaUsuario():string{
    const decodedToken = this.decodeRefrehToken();
    return decodedToken.sub?decodedToken.sub:''
  }

  public expirado(): boolean {
    const decodedToken = this.decodeToken();
    const now = Date.now().valueOf() / 1000;
    if (decodedToken && decodedToken.exp) {
      return decodedToken.exp < now;
    }
    return true;
  }

  public expiradoRefreshToken(): boolean {
    const decodedToken = this.decodeRefrehToken();
    const now = Date.now().valueOf() / 1000;
    if (decodedToken && decodedToken.exp) {
      return decodedToken.exp < now;
    }
    return true;
  }

  private getUserRoles(): string[] | null {
    const decodedToken = this.decodeRefrehToken();
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

  private decodeRefrehToken(): any {
    const token = this.getRefreshToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
}
