import { Component, OnInit ,Input } from '@angular/core';
import { DatosCompartidosService, Notificacion } from '../services/datos-compartidos.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ConfiguracionesComponent } from '../configuraciones/configuraciones.component';
import { UtilsService } from '../utils/utilitarios.util';
import { TokenService } from '../services/token.service';
import { DatosPersonalesComponent } from '../datos-personales/datos-personales.component';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit{

  @Input() name?: string;
  correo:string=''
  notificaciones: Notificacion[] = []

  constructor(
    private datosCompartidos: DatosCompartidosService,
    private restUtils: UtilsService,
    private alertController: AlertController,
    private tokenService: TokenService,
    private modalCtrl: ModalController
  ){}

  async ngOnInit() {
    this.correo = await this.tokenService.recuperaUsuario()
    /* this.datosCompartidos.correo$.subscribe(correo => {
      this.correo = correo;
    }); */
    this.datosCompartidos.notificaciones$.subscribe(notificaciones => {
      this.notificaciones = notificaciones;
    });
    this.recuperaNotificaciones()
  }

  async recuperaNotificaciones(){
    this.restUtils.recuperaNotificaciones().subscribe({
      next: async (response:any) => {
        this.datosCompartidos.actualizarNotificaciones(response as Notificacion[]);
        await this.verificaHorario();
        await this.verificaDatosPersonales();
      },
      error: (error:any) => {
      }
    });
  }

  async verificaHorario(){
    if(await this.verificaOrarioAtencion()){
      const notificac = await this.recuperaOrarioAtencionLocal();
      await this.horarioAtencionCliente(notificac!.valor)
    }
  }
  async verificaDatosPersonales(){
    if(await this.pedirDatospersonales()){
      await this.datosPersonales()
    }
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
      await this.recuperaNotificaciones()
    }
  }

  pedirDatospersonales():boolean{
    const item = this.notificaciones.find(elemento => elemento.metodo == 'datosPersonales');
    return item?true:false
  }

/*   async horarioAtencionCliente(mensaje:string){
    const alert = await this.alertController.create({
      header: 'Horario de atención',
      message: mensaje,
      buttons: ['Entiendo'],
      cssClass: 'alerta-horario'
    });

    await alert.present();
  } */

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
  

  async recuperaOrarioAtencionLocal(): Promise<Notificacion | undefined>{
    return this.notificaciones.find(elemento => elemento.metodo == 'horarioAtencion');
  }

  verificaOrarioAtencion():boolean{
    const item = this.notificaciones.find(elemento => elemento.metodo == 'horarioAtencion');
    return item?true:false
  }

  async configuraciones(){
    const modal = await this.modalCtrl.create({
      component: ConfiguracionesComponent
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
    }
  }

}
