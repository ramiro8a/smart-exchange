import { Component,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.sass']
})
export class DatosPersonalesComponent {
  estaCargando: boolean = false
  personalForm: FormGroup;
  tipoDocumentos: any[] = Const.TIPO_DOCUMENTOS

  constructor(
    private dialogRef: MatDialogRef<DatosPersonalesComponent>,
    private formBuilder: FormBuilder,
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

  registra():void{

  }

  esPersona():boolean{
    return this.personalForm.get('tipoDocumento')?.value != 2
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

}
