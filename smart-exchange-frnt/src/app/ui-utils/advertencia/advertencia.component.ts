import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

interface Contenido {
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
}

@Component({
  selector: 'app-advertencia',
  templateUrl: './advertencia.component.html',
  styleUrls: ['./advertencia.component.sass']
})
export class AdvertenciaComponent {
  contenido: Contenido
  constructor(
    private dialogRef: MatDialogRef<AdvertenciaComponent>,
    @Inject(MAT_DIALOG_DATA) data:Contenido
  ){
    this.contenido = data
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

}
