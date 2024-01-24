import { Component, OnInit } from '@angular/core';
import { TipoCambioService } from 'src/app/rest/tipo-cambio.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder ,FormGroup, Validators,FormArray  } from '@angular/forms'
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as Const from 'src/app/utils/constants.service'
import { CuentasBancariasComponent } from './cuentas-bancarias/cuentas-bancarias.component';
import { OperacionComponent } from './operacion/operacion.component';
import { BancosService } from '../rest/bancos.service';
import { ImporteValidator } from '../utils/validators.validator';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.sass']
})
export class ClienteComponent implements OnInit{
  notificaciones:number = 0
  soles = {
    desc: 'Recibo Soles',
    img: 'assets/img/peru.png',
    cod: Const.SOLES_ISO
  }
  usd = {
    desc: 'Envio Dólares',
    img: 'assets/img/usa.png',
    cod: Const.USD_ISO
  }
  ahorroImporte:number=0
  envio = this.usd
  recibo = this.soles
  tipoCambio: any;
  cuentasRegistradas: any[] = []
  bancos: any[]=[]
  operacionForm: FormGroup;
  monedas: any[] = Const.CUENTA_MONEDAS_CLIENTE
  estaCargando:boolean = false

  constructor(
    private dialog: MatDialog,
    private restTC: TipoCambioService,
    private restBancos: BancosService,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    ){
      this.operacionForm = this.formBuilder.group({
        envio: [1.00, [Validators.required, ImporteValidator()]],
        recibo: [0.00, [Validators.required, ImporteValidator()]],
      });
    }

  ngOnInit(): void {
    this.recuperaTC();
    this.operacionForm.get('envio')?.valueChanges.subscribe((valorEnvio) => {
      this.recalcula(valorEnvio)
/*       let montoRecibe = 0
      if(this.envio.cod===Const.USD_ISO){
        montoRecibe = this.redondearHalfUp(valorEnvio*this.tipoCambio.compra, 2)
        this.ahorroImporte = this.redondearHalfUp((valorEnvio*this.tipoCambio.compra)-(valorEnvio*this.tipoCambio.compraOficial), 2)
      }else{
        montoRecibe = this.redondearHalfUp(valorEnvio/this.tipoCambio.venta, 2)
        this.ahorroImporte = this.redondearHalfUp((valorEnvio*this.tipoCambio.venta)-(valorEnvio*this.tipoCambio.ventaOficial), 2)
      }
      this.operacionForm.controls['recibo'].setValue(montoRecibe); */
    });
  }

  recalcula(valorEnvio:number):void{
    let montoRecibe = 0
    if(this.envio.cod===Const.USD_ISO){
      montoRecibe = this.redondearHalfUp(valorEnvio*this.tipoCambio.compra, 2)
      this.ahorroImporte = this.redondearHalfUp((valorEnvio*this.tipoCambio.compra)-(valorEnvio*this.tipoCambio.compraOficial), 2)
    }else{
      montoRecibe = this.redondearHalfUp(valorEnvio/this.tipoCambio.venta, 2)
      this.ahorroImporte = this.redondearHalfUp((valorEnvio/this.tipoCambio.venta)-(valorEnvio/this.tipoCambio.ventaOficial), 2)
    }
    this.operacionForm.controls['recibo'].setValue(montoRecibe);
  }

  iniciarOperacion():void{
    if(this.operacionForm.valid){
      if(this.validarImporte()){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          tipoCambioId: this.tipoCambio.id,
          monto: this.operacionForm.get('envio')?.value,
          cambiado: this.operacionForm.get('recibo')?.value,
          origen: {
            moneda: this.envio.cod
          },
          destino: {
            moneda: this.recibo.cod
          }
        }
        dialogConfig.panelClass = 'operacion-dialog'
        const dialogRef = this.dialog.open(OperacionComponent, dialogConfig)
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            ///this.recuperaCuentasBancarias()
          }
        })
      }else{
        this.notif.notify('warning','La operacion mínima es de 1 dólar o su equivalente en soles');
      }
    }else{
      this.notif.notify('warning','Complete el formulario con datos válidos por favor');
    }
  }

  recuperaTC():void{
    this.estaCargando = true
    this.restTC.recuperaTCActual(Const.USD_ISO).subscribe({
      next: (response:any) => {
        this.tipoCambio = response
        this.estaCargando = false
        this.operacionForm.controls['envio'].setValue(10.00);
      },
      error: (error:any) => {
        this.estaCargando = false
      }
    });
  }

  validarImporte():boolean{
    let monto:number = this.operacionForm.get('envio')?.value
    if(this.envio.cod===Const.SOLES_ISO){
      monto = this.redondearHalfUp(monto/this.tipoCambio.venta, 2)
    }
    return monto>=1
  }

  cambiaMoneda():void{
    const valorEnvio:number=10.00
    this.operacionForm.controls['envio'].setValue(valorEnvio);
    if(this.envio.cod===Const.SOLES_ISO){
      this.envio = this.usd
      this.envio.desc ='Envio Dólares'
      this.recibo = this.soles
      this.recibo.desc ='Recibo Soles'
    }else{
      this.envio = this.soles
      this.envio.desc ='Envio Soles'
      this.recibo = this.usd
      this.recibo.desc ='Recibo Dólares'
    }
    this.recalcula(valorEnvio)
  }

  redondearHalfUp(numero: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(numero * factor) / factor;
  }

  recuperaNombre(codig:number):string{
    const item = this.monedas.find(elemento => elemento.codigo == codig);
    return item ? item.nombre : '';
  }

}
