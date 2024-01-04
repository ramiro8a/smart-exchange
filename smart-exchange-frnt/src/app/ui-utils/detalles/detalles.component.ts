import { Component } from '@angular/core';
import {MatBottomSheet, MAT_BOTTOM_SHEET_DATA ,MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Inject } from '@angular/core';
import { CuentaBancariaResponse } from 'src/app/rest/bancos.service';
import * as Const from 'src/app/utils/constants.service'
import { NotifierService } from 'angular-notifier';
import { UsuariosService, UsuarioResponse } from 'src/app/rest/usuarios.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.sass']
})
export class DetallesComponent {
  titulo:string=''
  opc:number = 0
  datos:any
  constructor(
    private bottomSheetRef: MatBottomSheetRef<DetallesComponent>,
    private notif: NotifierService,
    private restUsuario: UsuariosService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ){
    this.opc = data.opc
    this.datos = data.datos
    switch (this.opc) {
      case 1:
        this.titulo ='Detalle cuenta origen'
        break;
      case 2:
        this.titulo ='Detalle cuenta destino'
        break;
      case 3:
        this.titulo ='Detalle cuenta transferencia'
        break;
      case 4:
        this.titulo ='Detalle de cliente'
        this.recuperaCorreo(this.datos.usuarioId)
        break;
      default:
        console.log('Opcion por defecto');
    }
    
  }
  close(data:boolean){
    this.bottomSheetRef.dismiss()
  }

  buscarNombreDeEstadoCuenta(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.ESTADOS_GENERICOS);
  }
  buscarNombreDeTransferencia(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.TIPO_TRANSFERENCIAS);
  }
  buscarNombreDeMoneda(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.CUENTA_MONEDAS_CLIENTE);
  }
  buscarNombreTipoCuenta(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.TIPO_CUENTAS);
  }

  buscarNombreTipoDocumento(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.TIPO_DOCUMENTOS);
  }

  recuperaCorreo(usuarioId:number){
    this.restUsuario.recuperaUsuarioPorId(usuarioId).subscribe({
      next: (response:UsuarioResponse) => {
        this.datos.correo=response.correo
      },
      error: (error:any) => {
        
      }
  });
  }

  copiar(valor:any){
    navigator.clipboard.writeText(valor).then(() => {
      this.notif.notify('success','Copiado al portapapeles');
      console.log('Texto copiado al portapapeles!');
    }).catch(err => {
      this.notif.notify('error','No hemos podido copiar el valor');
    });
  }

}
