import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'
import { NotifierService } from 'angular-notifier';
import { UsuariosService, ClienteResponse } from 'src/app/rest/usuarios.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.sass']
})
export class DatosPersonalesComponent implements OnInit{
  estaCargando: boolean = false
  esNuevo:boolean = true
  personalForm: FormGroup;
  tipoDocumentos: any[] = Const.TIPO_DOCUMENTOS

  constructor(
    private dialogRef: MatDialogRef<DatosPersonalesComponent>,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    private restUsuario: UsuariosService
    ){
      this.personalForm = this.formBuilder.group({
                tipoDocumento: [1, [Validators.required]],
                nroDocumento: ['', [Validators.required]],
                nombres: ['', Validators.required],
                /* sNombre: [''], */
                paterno: ['', Validators.required],
                materno: [''],
                celular: [''],
                deAcuerdo: [false, [Validators.required]]
              });
    }
  
  ngOnInit(): void {
    this.recuperaDatosCliente()
    this.personalForm.get('tipoDocumento')?.valueChanges.subscribe((tipoDocumento) => {
      if(tipoDocumento===2){
        this.personalForm.controls['paterno'].setValidators([]);
      }else{
        this.personalForm.controls['paterno'].setValidators([Validators.required]);
      }
      this.personalForm.controls['paterno'].updateValueAndValidity();
    });
  }

  recuperaDatosCliente(){
    this.estaCargando = true
    this.restUsuario.recuperaCliente().subscribe({
      next: (response:ClienteResponse) => {
        response.tipoDocumento
        this.personalForm.setValue({
          tipoDocumento: response.tipoDocumento,
          nroDocumento: response.nroDocumento,
          nombres: response.nombres,
          paterno: response.paterno,
          materno: response.materno,
          celular: response.celular,
          deAcuerdo: true,
        })
        this.estaCargando = false;
        this.esNuevo = false
        this.personalForm.disable();
      },
      error: (error:any) => {
        this.estaCargando = false;
      }
    });
  }

  registra():void{
    if(this.personalForm.valid){
      this.estaCargando = true;
      this.restUsuario.registraDatosPersonalesCliente(this.personalForm.value).subscribe({
        next: (response:any) => {
          this.estaCargando = false;
          this.notif.notify('success', 'Datos registrados exitosamente');
          this.close(true);
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

  esPersona():boolean{
    return this.personalForm.get('tipoDocumento')?.value != 2
  }

  estaDeAcuerdo():boolean{
    return this.personalForm.get('deAcuerdo')?.value
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

}
