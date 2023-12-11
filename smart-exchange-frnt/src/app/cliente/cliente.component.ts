import { Component, OnInit } from '@angular/core';
import { TipoCambioService } from 'src/app/rest/tipo-cambio.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder ,FormGroup, Validators,FormArray  } from '@angular/forms'
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as Const from 'src/app/utils/constants.service'
import { CuentasBancariasComponent } from './cuentas-bancarias/cuentas-bancarias.component';
import { OperacionComponent } from './operacion/operacion.component';
import { BancosService } from '../rest/bancos.service';

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
  envio = this.usd
  recibo = this.soles
  tipoCambio: any;
  cuentasRegistradas: any[] = []
  bancos: any[]=[]
  operacionForm: FormGroup;
  

  constructor(
    private dialog: MatDialog,
    private restTC: TipoCambioService,
    private restBancos: BancosService,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    ){
      this.operacionForm = this.formBuilder.group({
        envio: [1.00, Validators.required],
        recibo: [0.00, [Validators.required]],
      });
    }

  ngOnInit(): void {
    this.recuperaTC();
    this.operacionForm.get('envio')?.valueChanges.subscribe((valorEnvio) => {
      let montoRecibe = 0
      if(this.envio.cod===Const.USD_ISO){
        montoRecibe = valorEnvio*this.tipoCambio.compra
      }else{
        montoRecibe = valorEnvio/this.tipoCambio.venta
      }
      this.operacionForm.controls['recibo'].setValue(montoRecibe);
    });
  }

  iniciarOperacion():void{
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
    const dialogRef = this.dialog.open(OperacionComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        ///this.recuperaCuentasBancarias()
      }
    })
  }

  recuperaTC():void{
    this.restTC.recuperaTCActual(Const.USD_ISO).subscribe({
      next: (response:any) => {
        this.tipoCambio = response
        this.operacionForm.controls['envio'].setValue(10.00);
      },
      error: (error:any) => {
      }
    });
  }

  cambiaMoneda():void{
    this.operacionForm.controls['envio'].setValue(10.00);
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
  }

}
