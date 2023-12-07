import { Component, OnInit } from '@angular/core';
import { TipoCambioService } from 'src/app/rest/tipo-cambio.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder ,FormGroup, Validators,FormArray  } from '@angular/forms'
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import * as Const from 'src/app/utils/constants.service'

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

  constructor(
    private dialog: MatDialog,
    private restTC: TipoCambioService,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    ){
    }

  ngOnInit(): void {
    this.recuperaTC();
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

}
