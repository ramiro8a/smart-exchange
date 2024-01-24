import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig} from "@angular/material/dialog";
import { CamaraComponent } from 'src/app/ui-utils/camara/camara.component';
import { OperacionService } from 'src/app/rest/operacion.service';
import { NotifierService } from 'angular-notifier';
import { BancosService, CuentaBancariaResponse } from 'src/app/rest/bancos.service';
import * as Const from 'src/app/utils/constants.service'

@Component({
  selector: 'app-carga-comprobante',
  templateUrl: './carga-comprobante.component.html',
  styleUrls: ['./carga-comprobante.component.sass']
})
export class CargaComprobanteComponent implements OnInit{
  estaCargando: boolean = false
  finaliza:boolean = false
  cuentasBancarias:CuentaBancariaResponse[]=[]
  imagen={
    captura: false,
    carga:false
  }
  operacionId:number
  finalizaForm = this.formBuilder.group({
    codigoTransferencia: ['', [Validators.required]],
    comprobante: ['', [Validators.required]],
    noTiene: [false],
    bancoTransFinal: [''],
  });

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private restOperacion: OperacionService,
    private restBancos: BancosService,
    private notif: NotifierService,
    private dialogRef: MatDialogRef<CargaComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) data:any
  ){
    this.operacionId = data.operacionId
    if(data.finaliza){
      this.finaliza = data.finaliza
    }
  }

  ngOnInit(): void {
    if(this.finaliza){
      this.recuperaBancosParaTransferencia()
      this.finalizaForm.controls['bancoTransFinal'].setValidators([Validators.required]);
      this.finalizaForm.controls['bancoTransFinal'].updateValueAndValidity();
    }
  }

  recuperaBancosParaTransferencia():void{
    this.estaCargando = true
    this.restBancos.recuperaBancosTransferenciaFinal(this.operacionId).subscribe({
      next: (response:CuentaBancariaResponse[]) => {
        this.estaCargando = false
        this.cuentasBancarias = response
      },
      error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
      }
    });
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

  buscarNombreDeMoneda(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.CUENTA_MONEDAS_CLIENTE);
  }

}
