import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DatosCompartidosService, Notificacion } from '../services/datos-compartidos.service';
import { DatosPersonalesComponent } from '../datos-personales/datos-personales.component';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent  implements OnInit {
  notificaciones: Notificacion[] = []

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private datosCompartidos: DatosCompartidosService
  ) { }

  

  async ngOnInit() {
    this.datosCompartidos.notificaciones$.subscribe(notificaciones => {
      this.notificaciones = notificaciones;
    });
  }

  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ejecutarMetodo(nombreMetodo: string, valor:string) {
    console.error(`método '${nombreMetodo}' valor '${valor}'`);
    const metodo = (this as any)[nombreMetodo];
    if (nombreMetodo=='horarioAtencion') {
      this.horarioAtencionCliente(valor)
    }
    if (typeof metodo == 'function') {
      metodo.bind(this)();
    }
    if (nombreMetodo=='validaDatosCliente') {
      this.datosPersonales()
    }
    this.confirm()
  }

  async horarioAtencionCliente(mensaje: string): Promise<void> {
    return new Promise(async resolve => {
      const alert = await this.alertController.create({
        header: 'Horario de atención',
        message: mensaje,
        buttons: [{
          text: 'Entiendo',
          handler: () => {
            resolve();
          }
        }],
        cssClass: 'alerta-horario'
      });
  
      await alert.present();
    });
  }

  async datosPersonales(){
    const modal = await this.modalCtrl.create({
      component: DatosPersonalesComponent,
      cssClass: 'modal-datos-personales',
      backdropDismiss: false,
      componentProps: {nuevo: true}
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
    }
  }

}
