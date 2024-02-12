import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { Network } from '@capacitor/network';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as Const from './constants.util';
import { environment } from './../../environments/environment';
import { errorHandler } from './error-handler.util';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {
    isOnline: boolean = false;
    path:string = '/api/utils'

    constructor(
      private toastController: ToastController,
      private zone: NgZone,
      private http: HttpClient
    ) {
      Network.getStatus().then((status) => {
        this.isOnline = status.connected;
      });
  
      Network.addListener('networkStatusChange', (status) => {
        this.zone.run(() => {
          this.isOnline = status.connected;
        });
      });
    }
  
    existsInternet():boolean{
      return this.isOnline
    }
  
    async showMessage(title: string ,message: string){
      const toast = await this.toastController.create({
        header: title.toUpperCase(),
        icon: 'globe',
        position: 'top',
        message: message,
        duration: Const.TOAST_TIME,
        buttons: [
          {
            side: 'end',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Close clicked');
            }
          }
        ]
      });
      toast.present();
    }
  
    existsVariable(variable:any):boolean{
      return !(Object.keys(variable).length === 0)
    }

  recuperaNotificaciones(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}${this.path}/notificaciones`).pipe(
      catchError(errorHandler)
    )
  }
  
}