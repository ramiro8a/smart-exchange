import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';
import * as Const from './../utils/constants.util'
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { AlertController, LoadingController } from '@ionic/angular';
import { TipoCambioService } from '../services/tipo-cambio.service';
import { BancosService } from '../services/bancos.service';
import { ImporteValidator } from '../utils/validators.validator';
import { UtilsService } from '../utils/utilitarios.util';
import { ModalController } from '@ionic/angular';
import { OperacionComponent } from '../operacion/operacion.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
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
  fechaActual: string =''

  constructor(
    private restTC: TipoCambioService,
    private restBancos: BancosService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private utils: UtilsService,
    private modalCtrl: ModalController
  ) { 
    moment.locale('es');
    this.operacionForm = this.formBuilder.group({
      envio: [1.00, [Validators.required, ImporteValidator()]],
      recibo: [0.00, [Validators.required, ImporteValidator()]],
    });
    //this.fechaActual= this.capitalizarPrimeraLetra(moment().format('dddd, DD [de] MMMM [de] YYYY'));
    this.fechaActual= moment().format('DD [de] MMMM [de] YYYY');
  }

  ngOnInit() {
    this.recuperaTC();
    this.operacionForm.get('envio')?.valueChanges.subscribe((valorEnvio) => {
      this.recalcula(valorEnvio)
    });
  }

  async iniciarOperacion(){
    if(this.operacionForm.valid){
      if(this.validarImporte()){
          const modal = await this.modalCtrl.create({
            component: OperacionComponent,
            componentProps:{
              cambio: {
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
            }
          });
          modal.present();
          const { data, role } = await modal.onWillDismiss();
          if (role === 'confirm') {
            console.log(`Hello, ${data}!`)
          }
      }else{
        this.utils.showMessage('Atención','La operacion mínima es de 1 dólar o su equivalente en soles');
      }
    }else{
      this.utils.showMessage('Atención','Complete el formulario con datos válidos por favor');
    }
  }

  validarImporte():boolean{
    let monto:number = this.operacionForm.get('envio')?.value
    if(this.envio.cod===Const.SOLES_ISO){
      monto = this.redondearHalfUp(monto/this.tipoCambio.venta, 2)
    }
    return monto>=1
  }

  capitalizarPrimeraLetra(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
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

  recuperaTC():void{
    this.estaCargando = true
    this.restTC.recuperaTCActual(Const.USD_ISO).subscribe({
      next: (response:any) => {
        this.tipoCambio = response
        this.estaCargando = false
        this.operacionForm.controls['envio'].setValue(10.00);
      },
      error: (error:Error) => {
        this.estaCargando = false
        this.utils.showMessage('Error',error.message);
      }
    });
  }

  redondearHalfUp(numero: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(numero * factor) / factor;
  }

  cambiaMoneda():void{
    const elemento = document.querySelector('.icon-cambio');
    const valorEnvio:number=10.00
    this.operacionForm.controls['envio'].setValue(valorEnvio);
    if(this.envio.cod===Const.SOLES_ISO){
      elemento?.classList.remove('girado');
      this.envio = this.usd
      this.envio.desc ='Envio Dólares'
      this.recibo = this.soles
      this.recibo.desc ='Recibo Soles'
    }else{
      elemento?.classList.add('girado');
      this.envio = this.soles
      this.envio.desc ='Envio Soles'
      this.recibo = this.usd
      this.recibo.desc ='Recibo Dólares'
    }
    this.recalcula(valorEnvio)
  }

}
