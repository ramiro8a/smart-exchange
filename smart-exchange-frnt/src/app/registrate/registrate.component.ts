import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { TCPublicoResponse, UsuariosService } from '../rest/usuarios.service';
import { ReCaptchaV3Service } from "ng-recaptcha";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmPasswordValidator } from '../utils/validators.validator';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-registrate',
  templateUrl: './registrate.component.html',
  styleUrls: ['./registrate.component.sass']
})
export class RegistrateComponent implements OnInit{
  hide1: boolean = true
  hide2: boolean = true
  estaCargando: boolean = false
  tiposCambio: TCPublicoResponse[]=[]
  lcExchange!: TCPublicoResponse
  sunat!: TCPublicoResponse
  banco!: TCPublicoResponse
  registraForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private restUsuarios: UsuariosService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private notif: NotifierService,
    private router: Router
    ){
      this.registraForm = this.formBuilder.group({
        correo: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(30)]],
        rePassword: ['', [Validators.required, Validators.minLength(8),
          Validators.maxLength(30)]],
      });
      this.registraForm.addValidators(ConfirmPasswordValidator('password', 'rePassword'))
  }

  ngOnInit(): void {
    this.recuperaTCPublico()
  }

  recuperaTCPublico():void{
    this.restUsuarios.recuperaTCPublico().subscribe({
      next: (tiposCambios:TCPublicoResponse[]) => {
        this.tiposCambio = tiposCambios
        this.asignaTCFuente()
      },
      error: (error:any) => {
        this.estaCargando = false;
        this.notif.notify('error', error);
      }
    });
  }

  asignaTCFuente():void{
    this.tiposCambio.forEach((item:TCPublicoResponse)=>{
      if(item.tipo===1){
        this.lcExchange = item
        console.log('EXCHANGE')
      }
      if(item.tipo===2){
        this.sunat = item
        console.log('WARN')
      }
      if(item.tipo===3){
        console.log('ERRO')
        this.banco = item
      }
    })
  }

  registra():void {
    if(this.registraForm.valid){
      this.estaCargando = true;
      this.recaptchaV3Service.execute('registro')
      .pipe(
        catchError(error => {
          this.estaCargando = false;
          return of(error);
        })
      )
      .subscribe(
        token => {
          if (token) {
            let values = this.registraForm.value
            values.token = token
            this.restUsuarios.registraCliente(values).subscribe({
              next: (response:any) => {
                this.estaCargando = false;
                this.notif.notify('success', 'Hemos enviado un link a su correo verifique por favor');
                this.router.navigate(['/login']);
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
