import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

export interface Contenido {
  texto: string;
  datos: Item[];
}
export interface Item {
  codigo: number;
  nombre: string;
}

@Component({
  selector: 'app-promp-selec',
  templateUrl: './promp-selec.component.html',
  styleUrls: ['./promp-selec.component.sass']
})
export class PrompSelecComponent {
  contenido: Contenido
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PrompSelecComponent>,
    private notif: NotifierService,
    @Inject(MAT_DIALOG_DATA) data:Contenido
  ){
    this.contenido = data
    this.form = this.formBuilder.group({
      valor: ['', Validators.required],
    });
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

  closeWithData(){
    if(this.form.valid){
      this.dialogRef.close(this.form.controls['valor'].value);
    }else{
      this.notif.notify('warning', 'Ingrese un valor por favor');
    }
  }
}
