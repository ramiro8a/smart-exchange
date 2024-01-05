import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.sass']
})
export class ImagenComponent {
  imagen!:string

  constructor(
    private dialogRef: MatDialogRef<ImagenComponent>,
    @Inject(MAT_DIALOG_DATA) data:any
  ){
    console.warn(data)
    this.imagen = 'data:image/jpeg;base64,'+data.base64.base64
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

}
