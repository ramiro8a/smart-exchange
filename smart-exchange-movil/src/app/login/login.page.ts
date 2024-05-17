import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { UsuariosService } from '../services/usuarios.service';
import { TokenService } from '../services/token.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';
import { DatosCompartidosService } from '../services/datos-compartidos.service';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  resetForm: FormGroup;
  hide: boolean = true;
  estaCargando: boolean = false
  panelOpen = false
  leyenda: string =''
  opcion:string=''
  biometricoEstaConfigurado: boolean =false

  constructor(
    private formBuilder: FormBuilder,
    private restUsuarios: UsuariosService,
    private router: Router,
    private tokenService: TokenService,
    private alertController: AlertController,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private datosCompartidos: DatosCompartidosService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.resetForm = this.formBuilder.group({
      dato: ['', Validators.required]
    });
    this.tokenService.removeToken()
  }

  async ngOnInit() {
    this.biometricoEstaConfigurado = await this.tokenService.haySecretoBiometrico();
  }

  async login() {
    if(this.loginForm.valid){
      let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
      await loading.present();
      this.restUsuarios.login(this.loginForm.value).subscribe({
        next: async(response:any) => {
          await this.tokenService.setToken(response)
          if(await this.tokenService.esCliente()){
            const correo = await this.tokenService.recuperaUsuario()
            //await this.datosCompartidos.agregarCorreo(correo);
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
            await loading.dismiss();
          }else{
            this.utils.showMessage('Alerta', 'Inicie sesión desde un navegador')
            await loading.dismiss();
          }
        },
        error: async(error:Error) => {
          await loading.dismiss();
          this.utils.showMessage('Error',error.message)
        }
      });
    }else{
      this.utils.showMessage('Atención','Complete el formulario por favor')
    }
  }

  leeBiometrico(){
    FingerprintAIO.loadBiometricSecret({
      title: 'LC-Exchange',
      subtitle: 'Necesitamos verificar que eres tú',
      description: 'Toca el sensor de huellas dactilares',
      disableBackup: true,
    }).then(async (val)=>{
      const datos = JSON.parse(val)
      let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
      await loading.present();
      this.restUsuarios.login(datos).subscribe({
        next: async(response:any) => {
          await this.tokenService.setToken(response)
          if(await this.tokenService.esCliente()){
            const correo = await this.tokenService.recuperaUsuario()
            //await this.datosCompartidos.agregarCorreo(correo);
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
            await loading.dismiss();
          }else{
            this.utils.showMessage('Alerta', 'Inicie sesión desde un navegador')
            await loading.dismiss();
          }
        },
        error: async(error:Error) => {
          await loading.dismiss();
          this.utils.showMessage('Error',error.message)
        }
      });
    }).catch(async(error)=>{
      this.utils.showMessage('Error','No hemos podido verificar tu identidad biométrica')
    })
  }

  async cuentasAux(opc:number){
    let texto = ''
    if(opc==1){
      texto = 'cambiar su contraseña'
    }
    if(opc==2){
      texto = 'confirmar su correo'
    }
    const alert = await this.alertController.create({
      header: `Ingrese su correo, se le enviará un link para ${texto}`,
      inputs: [{name: 'email',type: 'email', placeholder: 'Correo'}],
      buttons: [
        {
          text: 'Cancelar', role: 'cancel', cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Ok',
          handler: async(data) => {
            if(data.email && this.esEmailValido(data.email)){
              const emailEnvio=data.email
              let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
              await loading.present();
              this.restUsuarios.cuentasClienteAux({opc:opc, emailEnvio}).subscribe({
                next: async(response:any) => {
                  this.estaCargando = false
                  this.utils.showMessage('Genial',`Le hemos enviado un link a su correo para ${texto}`)
                  await loading.dismiss();
                },
                error: async(error:Error) => {
                  await loading.dismiss();
                  this.utils.showMessage('Error',error.message)
                }
              });
            }else{
              this.utils.showMessage('Alerta','Debe ingresar un correo válido')
            }
          }
        }
      ]
    });

    await alert.present();
  }

  esEmailValido(email: string): boolean {
    const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexEmail.test(email);
  }

}
