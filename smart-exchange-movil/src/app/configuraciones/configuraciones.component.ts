import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';
import { DatosCompartidosService } from '../services/datos-compartidos.service';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss'],
})
export class ConfiguracionesComponent  implements OnInit {
  biometricoHabilitado: boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private datosCompartidos: DatosCompartidosService,
    private restUsuarios: UsuariosService,
    private loadingController: LoadingController,
    private utils: UtilsService
  ) { }

  ngOnInit() {}

  async biometricoCambio(){
    if(this.biometricoHabilitado){
      await this.configuraBiometrico()
    }else{
      await  this.eliminaConfBiometrico()
    }
  }

  async configuraBiometrico(){
    const alert = await this.alertController.create({
      header: 'Ingresa tu contraseña',
      inputs: [{name: 'password',type: 'text', placeholder: 'Password'}],
      buttons: [
        {
          text: 'Cancelar', role: 'cancel', cssClass: 'secondary',
          handler: () => {
            this.biometricoHabilitado = !this.biometricoHabilitado
          }
        }, {
          text: 'Ok',
          handler: async(data) => {
            if(data.password){
              let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Recuperando usuario'});
              await loading.present();
              this.datosCompartidos.correo$.subscribe(correo => {
/*                 this.restUsuarios.login({username: correo, password: data.password}).subscribe({
                  next: async(response:any) => {
                    await this.tokenService.setToken(response)
                    const correo = await this.tokenService.recuperaUsuario()
                    await this.datosCompartidos.agregarCorreo(correo);
                    this.router.navigateByUrl('/tabs', { replaceUrl: true });
                    await loading.dismiss();
                  },
                  error: async(error:Error) => {
                    await loading.dismiss();
                    this.utils.showMessage('Error',error.message)
                  }
                }); */
              });
            }else{
              this.utils.showMessage('Alerta','Debe ingresar un valor válido')
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminaConfBiometrico(){

  }

  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
