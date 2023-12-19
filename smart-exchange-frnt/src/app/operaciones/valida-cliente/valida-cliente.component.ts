import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-valida-cliente',
  templateUrl: './valida-cliente.component.html',
  styleUrls: ['./valida-cliente.component.sass']
})
export class ValidaClienteComponent implements OnInit{
  clienteId: number = 0

  constructor(
    private dialogRef: MatDialogRef<ValidaClienteComponent>,
    @Inject(MAT_DIALOG_DATA) data:number
  ){
    this.clienteId = data
  }

  ngOnInit(): void {
    console.log('pedir datos para '+this.clienteId)
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

}
