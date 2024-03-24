import { Component,OnInit , Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
import { ComprobanteResponse, ComprobanteVentaResponse, FacturaService } from 'src/app/rest/factura.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.sass']
})
export class FacturaComponent implements OnInit{
  operacionId:number
  estaCargando:boolean = false
  comprobante!: ComprobanteVentaResponse

  constructor(
    private restFactura: FacturaService,
    private notif: NotifierService,
    private dialogRef: MatDialogRef<FacturaComponent>,
    @Inject(MAT_DIALOG_DATA) data:any
  ){
    this.operacionId = data.operacionId
  }

  ngOnInit(): void {
    this.recuperaComprobante(this.operacionId)
  }

  recuperaArchivosSunat(id: number,tipo: number){
    this.estaCargando = true
    this.restFactura.recuperaArchivosSunat(id, tipo).subscribe({
      next: (response:ComprobanteResponse) => {
        this.downloadBase64File(response.base64, response.prefijo+"_"+response.nombreArchivo);
        this.estaCargando = false
      },
      error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
      }
    });
  }

  downloadBase64File(base64Data: string, filename: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
  
    const file = new Blob([byteArray], { type: 'application/octet-stream' });
    const fileURL = URL.createObjectURL(file);
  
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(fileURL);  
    }, 0);
  }
  

  recuperaComprobante(operacionId: number){
    this.estaCargando = true
    this.restFactura.recuperaFactura(operacionId).subscribe({
      next: (response:ComprobanteVentaResponse) => {
        this.estaCargando = false
        this.comprobante = response
        console.log(this.comprobante)
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


  reEnvio(id: number){
    this.estaCargando = true
    this.restFactura.reEnviaFacturaSunat(id).subscribe({
      next: (response:ComprobanteVentaResponse) => {
        this.estaCargando = false
        this.comprobante = response
        console.log(this.comprobante)
      },
      error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
      }
    });
  }

}
