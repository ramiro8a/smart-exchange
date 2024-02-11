import { Component,OnInit, Input } from '@angular/core';
import * as Const from './../utils/constants.util'
import { ModalController } from '@ionic/angular';
import { OperacionResponse } from '../services/operacion.service';
import { ViewWillEnter } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';

@Component({
  selector: 'app-operacion-cuentas',
  templateUrl: './operacion-cuentas.component.html',
  styleUrls: ['./operacion-cuentas.component.scss'],
})
export class OperacionCuentasComponent  implements OnInit, ViewWillEnter {
  @Input() operacion!: OperacionResponse
  constructor(
    private modalCtrl: ModalController,
    private utils: UtilsService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    console.log(this.operacion)
  }

  copiar(valor:any){
    navigator.clipboard.writeText(valor).then(() => {
      this.utils.showMessage('Genial!', 'Texto copiado al portapapeles');
    }).catch(err => {
      this.utils.showMessage('Error', 'No hemos podido copiar el valor');
    });
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
  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
