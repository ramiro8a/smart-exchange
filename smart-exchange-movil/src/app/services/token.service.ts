import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  TOKEN: string = 'token';
  REFRESH_TOKEN: string = 'refreshToken';

  constructor() { }

  public async setToken(data: any): Promise<void> {
    await Preferences.set({ key: this.TOKEN, value: data.token });
    await Preferences.set({ key: this.REFRESH_TOKEN, value: data.refreshToken });
  }

  public async getToken(): Promise<string | null> {
    const item = await Preferences.get({ key: this.TOKEN });
    return item.value;
  }

  public async getRefreshToken(): Promise<string | null> {
    const item = await Preferences.get({ key: this.REFRESH_TOKEN });
    return item.value;
  }
  
  public async removeToken(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN });
    await Preferences.remove({ key: this.REFRESH_TOKEN });
  }

  public async recuperaUsuario(): Promise<string> {
    const decodedToken = await this.decodeRefrehToken();
    return decodedToken && decodedToken.sub ? decodedToken.sub : '';
  }

  public async recuperaUsuarioId(): Promise<number> {
    const decodedToken = await this.decodeRefrehToken();
    return decodedToken && decodedToken.id ? decodedToken.id : 0;
  }

  public async expirado(): Promise<boolean> {
    const decodedToken = await this.decodeToken();
    const now = Date.now().valueOf() / 1000;
    return decodedToken && decodedToken.exp ? decodedToken.exp < now : true;
  }

  public async expiradoRefreshToken(): Promise<boolean> {
    const decodedToken = await this.decodeRefrehToken();
    const now = Date.now().valueOf() / 1000;
    return decodedToken && decodedToken.exp ? decodedToken.exp < now : true;
  }

  private async getUserRoles(): Promise<string[] | null> {
    const decodedToken = await this.decodeRefrehToken();
    if (decodedToken && decodedToken.roles) {
      return decodedToken.roles.map((role: any) => role.authority);
    }
    return null;
  }

  private async decodeToken(): Promise<any> {
    const token = await this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  private async decodeRefrehToken(): Promise<any> {
    const token = await this.getRefreshToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
}
