import { Component, OnInit ,Input } from '@angular/core';
import { DatosCompartidosService, Notificacion } from '../services/datos-compartidos.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ConfiguracionesComponent } from '../configuraciones/configuraciones.component';
import { UtilsService } from '../utils/utilitarios.util';
import { TokenService } from '../services/token.service';

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

  recuperaNotificaciones():void{
    this.restUtils.recuperaNotificaciones().subscribe({
      next: (response:any) => {
        this.datosCompartidos.actualizarNotificaciones(response as Notificacion[]);
/*         if(this.pedirDatospersonales()){
          this.datosPersonales()
        } */
        if(this.verificaOrarioAtencion()){
          const notificac = this.recuperaOrarioAtencionLocal();
          this.horarioAtencionCliente(notificac!.valor)
        }
      },
      error: (error:any) => {
      }
    });
  }

  async horarioAtencionCliente(mensaje:string){
    const alert = await this.alertController.create({
      header: 'Horario de atención',
      message: mensaje,
      buttons: ['Entiendo'],
      cssClass: 'alerta-horario'
    });

    await alert.present();
  }

  recuperaOrarioAtencionLocal():Notificacion | undefined{
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
