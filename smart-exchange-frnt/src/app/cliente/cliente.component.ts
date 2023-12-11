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
    desc: 'Envio Soles',
    img: 'assets/img/peru.png',
    cod: Const.SOLES_ISO
  }
  usd = {
    desc: 'Envio Dólares',
    img: 'assets/img/usa.png',
    cod: Const.USD_ISO
  }
  envio = this.soles
  recibo = this.usd
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
  }

  iniciarOperacion():void{
    const dialogRef = this.dialog.open(OperacionComponent)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //this.recuperaCuentasBancarias()
      }
    })
  }

  recuperaTC():void{
    this.restTC.recuperaTCActual(Const.USD_ISO).subscribe({
      next: (response:any) => {
        this.tipoCambio = response
      },
      error: (error:any) => {
      }
    });
  }

  cambiaMoneda():void{
    if(this.envio.cod===Const.SOLES_ISO){
      this.envio = this.usd
      this.recibo = this.soles
    }else{
      this.envio = this.soles
      this.recibo = this.usd
    }
  }


  recupertaBancos():void{
    this.restBancos.recuperaBancosActivos().subscribe({
      next: (response:any) => {
        this.bancos = response
      },
      error: (error:any) => {
        this.notif.notify('error', error);
      }
    });
  }

}
