import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';
import { DatosCompartidosService } from '../services/datos-compartidos.service';
import { UsuariosService } from '../services/usuarios.service';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss'],
})
export class ConfiguracionesComponent  implements OnInit {
  biometricoEstaConfigurado: boolean = false;
  tieneBiometrico:boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private datosCompartidos: DatosCompartidosService,
    private restUsuarios: UsuariosService,
    private loadingController: LoadingController,
    private tokenService: TokenService,
    private utils: UtilsService
  ) { }

  async ngOnInit() {
    FingerprintAIO.isAvailable().then(async (result)=>{
      console.warn('ngOnInit: '+result)
      this.tieneBiometrico = true;
      this.biometricoEstaConfigurado = await this.tokenService.haySecretoBiometrico();
    }).catch((error)=>{
      console.error('ngOnInit: '+error)
    })
  }

  async biometricoCambio(){
    if(this.biometricoEstaConfigurado){
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
            this.biometricoEstaConfigurado = !this.biometricoEstaConfigurado
          }
        }, {
          text: 'Ok',
          handler: async(data) => {
            if(data.password){
              this.datosCompartidos.correo$.subscribe(correo => {
                  this.registrarValidar(correo, data.password);
              });
            }else{
              this.biometricoEstaConfigurado = !this.biometricoEstaConfigurado
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
          secret: JSON.stringify({username:correo,password:password})
        }).then(async(result:any)=>{
          console.warn('config 95: '+JSON.stringify(result))
          await this.tokenService.guardaConfiguracionBiometrica()
          this.utils.showMessage('Genial','Configuración guardada')
          await loading.dismiss();
        }).catch(async(error:any)=>{
          this.biometricoEstaConfigurado = !this.biometricoEstaConfigurado
          console.warn('config 99: '+JSON.stringify(error))
          await loading.dismiss();
          this.utils.showMessage('Error',error)
        })
      },
      error: async(error:Error) => {
        this.biometricoEstaConfigurado = !this.biometricoEstaConfigurado
        await loading.dismiss();
        this.utils.showMessage('Error',error.message)
      }
    });
  }

  async eliminaConfBiometrico(){
    await this.tokenService.eliminaConfigBiometrica()
  }

  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
