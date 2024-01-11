import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { UsuariosService } from '../rest/usuarios.service';
import { ReCaptchaV3Service } from "ng-recaptcha";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { NotifierService } from 'angular-notifier';
import { TokenService } from '../servicios/token.service';
import { PromptComponent } from '../ui-utils/prompt/prompt.component';

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
    private dialog: MatDialog,
    private restUsuarios: UsuariosService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private notif: NotifierService,
    private router: Router,
    private tokenService: TokenService,
    ){
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
      this.resetForm = this.formBuilder.group({
        dato: ['', Validators.required]
      });
      this.tokenService.removeToken()
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

  cuentasAux(opc:number):void{
    const dialogConfig = new MatDialogConfig();
    let texto = ''
    if(opc==1){
      texto = 'cambiar su contraseña'
    }
    if(opc==2){
      texto = 'confirmar su correo'
    }
    dialogConfig.data = {
      texto: `Ingrese su correo, se le enviará un correo para ${texto}`,
      label: 'Email',
      tipoInput: 'email'
    }
    const dialogRef = this.dialog.open(PromptComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.estaCargando = true
        this.restUsuarios.cuentasClienteAux({opc:opc, email:result}).subscribe({
          next: (response:any) => {
            this.estaCargando = false
          },
          error: (error:any) => {
            this.notif.notify('error',error);
            this.estaCargando = false
          }
        });
      }
    })
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
