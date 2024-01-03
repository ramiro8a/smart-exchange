import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam/public_api';
import {Subject, Observable} from 'rxjs';

interface Contenido {
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
}

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.sass']
})
export class CamaraComponent implements OnInit{
  contenido: Contenido
  allowCameraSwitch = false;
  trigger: Subject<void> = new Subject<void>();
  webcamImage: WebcamImage | undefined;

  constructor(
    private dialogRef: MatDialogRef<CamaraComponent>,
    @Inject(MAT_DIALOG_DATA) data:Contenido
  ){
    this.contenido = data
  }

  ngOnInit(): void {
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("El usuario denegó permisos a la camara");
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  limpiar(){
    this.webcamImage = undefined;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

  devuelveDatos(){
    this.dialogRef.close({base64: this.webcamImage?.imageAsDataUrl});
  }
}
