import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';
import { DatosCompartidosService } from '../services/datos-compartidos.service';
import { UsuariosService } from '../services/usuarios.service';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss'],
})
export class ConfiguracionesComponent  implements OnInit {
  biometricoHabilitado: boolean = false;
  tieneBiometrico:boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private datosCompartidos: DatosCompartidosService,
    private restUsuarios: UsuariosService,
    private loadingController: LoadingController,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    FingerprintAIO.isAvailable().then((result)=>{
      console.warn(result)
      this.tieneBiometrico = true;
    },(error)=>{
      this.tieneBiometrico= false;
    })
  }

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
              this.datosCompartidos.correo$.subscribe(correo => {
                FingerprintAIO.show({
                  title: 'LC-Exchange',
                  subtitle: 'Necesitamos verificar que eres tú',
                  description: 'Toca el sensor de huellas dactilares',
                  disableBackup: true,
                  cancelButtonTitle: 'CANCELAR'
                }).then(async (val)=>{
                  console.warn(JSON.stringify(val))
                  this.registrarValidar(correo, data.password);
                }).catch(async(error)=>{
                  this.utils.showMessage('Error','No hemos podido verificar tu identidad biométrica')
                })
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

  async registrarValidar(correo:string, password:string){
    let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Verificando su identidad'});
    await loading.present();
    this.restUsuarios.login({username: correo, password: password}).subscribe({
      next: async(response:any) => {
        FingerprintAIO.registerBiometricSecret({
          title: 'Lc-Exchange',
          subtitle: 'Necesitamos verificar que eres tú',
          description: correo,
          secret: password
        }).then(async(result:any)=>{
          console.warn(JSON.stringify(result))
          await loading.dismiss();
        }).catch(async(error:any)=>{
          await loading.dismiss();
          this.utils.showMessage('Error',error)
        })
        
      },
      error: async(error:Error) => {
        await loading.dismiss();
        this.utils.showMessage('Error',error.message)
      }
    });
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
