import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { UsuariosService } from '../services/usuarios.service';
import { TokenService } from '../services/token.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';
import { DatosCompartidosService } from '../services/datos-compartidos.service';

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

  ngOnInit() {
  }


  async login() {
    if(this.loginForm.valid){
      let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
      await loading.present();
      this.restUsuarios.login(this.loginForm.value).subscribe({
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
      });
    }else{
      this.utils.showMessage('Atención','Complete el formulario por favor')
    }
  }

}
