import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { dialogAnimations } from '../dialog-animations';

interface Contenido {
  texto: string;
  label: string;
  tipoInput?: string;
}

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.sass'],
  animations: [
    dialogAnimations
  ]
})
export class PromptComponent implements OnInit{
  estado: boolean = true
  contenido: Contenido
  form: FormGroup;
  tipoInput:string = 'text'

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PromptComponent>,
    private notif: NotifierService,
    @Inject(MAT_DIALOG_DATA) data:Contenido
  ){
    this.contenido = data
    if(this.contenido.tipoInput){
      this.tipoInput=this.contenido.tipoInput
    }
    this.form = this.formBuilder.group({
      valor: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.tipoInput=='email'){
      this.form.controls['valor'].setValidators([Validators.required, Validators.email]);
      this.form.controls['valor'].updateValueAndValidity();
    }
  }

  close(data:boolean){
    this.estado=false
    this.dialogRef.close(data);
  }

  closeWithData(){
    if(this.form.valid){
      this.dialogRef.close(this.form.controls['valor'].value);
    }else{
      this.notif.notify('warning', 'Ingrese un valor válido por favor');
    }
  }
}
