import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { ConfirmPasswordValidator } from '../utils/validators.validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';

@Component({
  selector: 'app-registrate',
  templateUrl: './registrate.page.html',
  styleUrls: ['./registrate.page.scss'],
})
export class RegistratePage implements OnInit {
  hide1: boolean = true
  hide2: boolean = true
  estaCargando: boolean = false
  registraForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private restUsuarios: UsuariosService,
    private router: Router,
    private utils: UtilsService,
    private loadingController: LoadingController,
  ) { 
    this.registraForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),
      Validators.maxLength(30)]],
      rePassword: ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(30)]],
    });
    this.registraForm.addValidators(ConfirmPasswordValidator('password', 'rePassword'))
  }

  ngOnInit() {
  }

  async registra(){
    if(this.registraForm.valid){
      let loading = await this.loadingController.create({spinner: 'bubbles',message: 'Espere por favor'});
      await loading.present();
      this.restUsuarios.registraCliente(this.registraForm.value).subscribe({
        next: async(response:any) => {
          await loading.dismiss();
          this.utils.showMessage('Genial','Hemos enviado un link a su correo verifique por favor')
          this.router.navigate(['/login']);
        },
        error: async(error:Error) => {
          await loading.dismiss();
          this.utils.showMessage('Error',error.message)
        }
      });
    }else{
      const errores = this.generarMensajesDeError(this.registraForm);
      this.utils.showMessage('Atención', errores);
    }
  }

  getErrorMessage(formControlName: string, errorKey: string, errorValue?: any): string {
    const messages: { [key: string]: string } = {
      'required': `${formControlName} es obligatorio`,
      'email': `${formControlName} debe ser uno válido`,
      'minlength': `${formControlName} debe tener al menos ${errorValue.requiredLength} caracteres`,
      'maxlength': `${formControlName} debe tener máximo ${errorValue.requiredLength} caracteres`,
      'confirmPasswordValidator': `Las dos contraseñas deben ser iguales`,
    };
    return messages[errorKey] || `Error en ${formControlName}`;
  }

  generarMensajesDeError(form: FormGroup):string {
    let errores: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.invalid) {
        Object.keys(control.errors!).forEach(errorKey => {
          const mensajeError = this.getErrorMessage(key, errorKey, control.errors![errorKey]);
          errores.push(mensajeError);
        });
      }
    });
  
    return errores.join(', ');
  }
}