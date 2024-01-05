import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

interface Contenido {
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
}

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.sass']
})
export class ConfirmacionComponent {
contenido: Contenido

  constructor(
    private dialogRef: MatDialogRef<ConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) data:Contenido
  ){
    this.contenido = data
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }
}
