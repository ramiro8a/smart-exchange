import { Component, Inject } from '@angular/core';
import { UsuariosService } from 'src/app/rest/usuarios.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { ConfirmPasswordValidator } from 'src/app/utils/validators.validator';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.sass']
})
export class CambioPasswordComponent {
  hide1: boolean = true
  hide2: boolean = true
  estaCargando: boolean = false
  resetForm: FormGroup;
  id:number = 0

  constructor(
    private restUsuarios: UsuariosService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CambioPasswordComponent>,
    private notif: NotifierService,
    @Inject(MAT_DIALOG_DATA) data:any
    ){
      if(data?.id){
        this.id = data.id
      }
      this.resetForm = this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(8),
                Validators.maxLength(30)]],
                rePassword: ['', [Validators.required, Validators.minLength(8),
                  Validators.maxLength(30)]],
              });
      this.resetForm.addValidators(ConfirmPasswordValidator('password', 'rePassword'))
  }

  cambioPassword():void {
    if(this.resetForm.valid){
      this.estaCargando = true;
      let values = this.resetForm.value
      values.id=this.id
      this.restUsuarios.cambioPassworUsuario(values).subscribe({
        next: (response:any) => {
          this.estaCargando = false;
          let mensaje='Cierre y vuelva a iniciar sesión con su nueva contraseña'
          if(this.id!=0){
            mensaje = 'Contraseña actualizada exitosamente'
          }
          this.close(true);
          this.notif.notify('success', mensaje);
        },
        error: (error:any) => {
          this.estaCargando = false;
          this.notif.notify('error', error);
        }
      });
    }else{
      this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

}
