import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'
import { UsuariosService } from '../rest/usuarios.service';
import { ReCaptchaV3Service } from "ng-recaptcha";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { TokenService } from '../servicios/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide: boolean = true;
  estaCargando: boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private restUsuarios: UsuariosService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private notif: NotifierService,
    private router: Router,
    private tokenService: TokenService
    ){
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  login():void {
    if(this.loginForm.valid){
      this.estaCargando = true;
      this.recaptchaV3Service.execute('login')
      .pipe(
        catchError(error => {
          this.estaCargando = false;
          return of(error);
        })
      )
      .subscribe(
        token => {
          if (token) {
            let values = this.loginForm.value
            values.token = token
            this.restUsuarios.login(values).subscribe({
              next: (response:any) => {
                this.estaCargando = false;
                this.tokenService.setToken(response)
                if (this.tokenService.esAdmin()) {
                  this.router.navigate(['/admin'])
                } else if (this.tokenService.esGerente()) {
                  this.router.navigate(['/reportes'])
                } else if (this.tokenService.esOperador()) {
                  this.router.navigate(['/operaciones'])
                } else if (this.tokenService.esCliente()) {
                  this.router.navigate(['/cliente'])
                }else{
                  this.router.navigate(['/login']);
                }
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

  panelManager(){

  }

}
