import { Component, Inject } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig} from "@angular/material/dialog";
import { CamaraComponent } from 'src/app/ui-utils/camara/camara.component';
import { OperacionService } from 'src/app/rest/operacion.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-carga-comprobante',
  templateUrl: './carga-comprobante.component.html',
  styleUrls: ['./carga-comprobante.component.sass']
})
export class CargaComprobanteComponent {
  estaCargando: boolean = false
  finaliza:boolean = false
  imagen={
    captura: false,
    carga:false
  }
  operacionId:number
  finalizaForm = this.formBuilder.group({
    codigoTransferencia: ['', [Validators.required]],
    comprobante: ['', [Validators.required]],
    noTiene: [false]
  });

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private restOperacion: OperacionService,
    private notif: NotifierService,
    private dialogRef: MatDialogRef<CargaComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) data:any
  ){
    this.operacionId = data.operacionId
    if(data.finaliza){
      this.finaliza = data.finaliza
    }
  }


  close(data:boolean){
    this.dialogRef.close(data);
  }

  abrirCamara():void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titulo: 'Tome una foto al comprobante',
      subtitulo: 'Asegurese de que la imagen sea nítida'
    } 
    const dialogRef = this.dialog.open(CamaraComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.asignaComprobante(result.base64)
        this.imagen = {
          captura: true,
          carga: false
        }
      }
    })
  }

  asignaComprobante(base64: string):void{
    this.finalizaForm.controls['comprobante'].setValue(base64);
  }

  enviarCoprobante(){
    this.estaCargando=true
    if(this.finaliza){
      this.restOperacion.finalizaOperacion(this.operacionId, this.finalizaForm.value).subscribe({
        next: (response:any) => {
          this.close(true)
          this.estaCargando = false
        },
        error: (error:any) => {
          this.notif.notify('error',error);
          this.estaCargando = false
        }
      });
    }else{
      this.restOperacion.actualizaComprobante(this.operacionId, this.finalizaForm.value).subscribe({
        next: (response:any) => {
          this.close(true)
          this.estaCargando=false
        },
        error: (error:any) => {
          this.notif.notify('error', error);
          this.estaCargando=false
        }
      });
    }
  }

  archivoSeleccionado(event: any):void{
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          const base64 = e.target.result;
          this.asignaComprobante(base64)
          this.imagen = {
            captura: false,
            carga: true
          }
      };
      reader.readAsDataURL(file);
    }
  }

}
