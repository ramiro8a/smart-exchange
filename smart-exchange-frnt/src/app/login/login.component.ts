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
  resetForm: FormGroup;
  hide: boolean = true;
  estaCargando: boolean = false
  panelOpen = false
  leyenda: string =''
  opcion:string=''

  constructor(
    private formBuilder: FormBuilder,
    private restUsuarios: UsuariosService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private notif: NotifierService,
    private router: Router,
    private tokenService: TokenService
    ){
      this.loginForm = this.formBuilder.group({
        username: ['admin', Validators.required],
        password: ['admin', Validators.required]
      });
      this.resetForm = this.formBuilder.group({
        dato: ['', Validators.required]
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
                  this.router.navigate(['/operaciones/principal'])
                } else if (this.tokenService.esCliente()) {
                  this.router.navigate(['/cliente/nueva-operacion'])
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

  panelManager(opc:string):void{
    if(this.panelOpen && (this.opcion!=opc)){
      if(opc=='RESET'){
        this.leyenda='cambiar su contraseña'
        this.opcion=opc
      }
      if(opc=='CONFIRM'){
        this.leyenda='activar su cuenta.'
        this.opcion=opc
      }
    }else{
      if(opc=='RESET'){
        this.panelOpen=!this.panelOpen
        this.leyenda='cambiar su contraseña'
        this.opcion=opc
      }
      if(opc=='CONFIRM'){
        this.panelOpen=!this.panelOpen
        this.leyenda='activar su cuenta'
        this.opcion=opc
      }
    }
  }

  executeAction(action: string): void {
    if(this.resetForm.valid){
      this.estaCargando = true;
      this.recaptchaV3Service.execute('reset-data-login')
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
}
