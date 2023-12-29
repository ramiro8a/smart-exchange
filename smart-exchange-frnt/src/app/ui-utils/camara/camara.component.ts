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
  public allowCameraSwitch = false;
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage | undefined;

  constructor(
    private dialogRef: MatDialogRef<CamaraComponent>,
    @Inject(MAT_DIALOG_DATA) data:Contenido
  ){
    this.contenido = data
  }

  public ngOnInit(): void {
    console.log(this.webcamImage)
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("El usuario denegó permisos a la camara");
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    console.log(this.webcamImage)
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  limpiar(){
    this.webcamImage = undefined;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }
}
