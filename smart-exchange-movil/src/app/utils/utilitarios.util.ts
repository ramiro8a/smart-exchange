import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NgZone } from '@angular/core';
import { Network } from '@capacitor/network';
import * as Const from './constants.util';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {
    isOnline: boolean = false;

    constructor(
      private toastController: ToastController,
      private zone: NgZone,
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
        icon: 'information-circle',
        position: 'top',
        message: message,
        duration: Const.TOAST_TIME
      });
      toast.present();
    }
  
    existsVariable(variable:any):boolean{
      return !(Object.keys(variable).length === 0)
    }
  
  }