import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

interface Contenido {
  texto: string;
  label: string;
}

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.sass']
})
export class PromptComponent {
  contenido: Contenido
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PromptComponent>,
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
