import { Component } from '@angular/core';
import {MatBottomSheet, MAT_BOTTOM_SHEET_DATA ,MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Inject } from '@angular/core';
import { CuentaBancariaResponse } from 'src/app/rest/bancos.service';
import * as Const from 'src/app/utils/constants.service'

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
      default:
        console.log('Opcion por defecto');
    }
    console.log(data); // Accede a los datos aquí
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

}
