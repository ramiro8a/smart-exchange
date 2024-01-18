import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../rest/usuarios.service';
import { Router, ActivatedRoute } from "@angular/router";
import { NotifierService } from 'angular-notifier';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { ConfirmPasswordValidator } from '../utils/validators.validator';
import { ReCaptchaV3Service } from "ng-recaptcha";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.sass']
})
export class PasswordResetComponent implements OnInit {
  hide1: boolean = true
  hide2: boolean = true
  estaCargando: boolean = false
  cambiado: boolean = false
  resetForm: FormGroup;
  tokenReset!: string 

  constructor(
    private restUsuarios: UsuariosService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private notif: NotifierService){
      this.resetForm = this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(8),
                Validators.maxLength(30)]],
                rePassword: ['', [Validators.required, Validators.minLength(8),
                  Validators.maxLength(30)]],
              });
      this.resetForm.addValidators(ConfirmPasswordValidator('password', 'rePassword'))
  }

  ngOnInit(): void {
    if(this.activatedRoute?.snapshot?.params['token']){
      this.tokenReset = this.activatedRoute.snapshot.params['token']
    }else{
      window?.top?.close()
    }
  }

  registra():void {
    if(this.resetForm.valid){
      this.estaCargando = true;
      this.recaptchaV3Service.execute('registro')
      .pipe(
        catchError(error => {
          this.estaCargando = false;
          return of(error);
        })
      )
      .subscribe( token => {
          if (token) {
            let values = this.resetForm.value
            values.token = this.tokenReset
            values.tokenRecaptcha = token
            this.restUsuarios.resetPasswordCliente(values).subscribe({
              next: (response:any) => {
                this.cambiado=true
                this.estaCargando = false;
                this.notif.notify('success', 'Hemos enviado un link a su correo verifique por favor');
              },
              error: (error:any) => {
                this.estaCargando = false;
                this.notif.notify('error', error);
              }
            });
          }
        }
      );
    }else{
      this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  cierra():void{
    window?.top?.close()
  }
}
