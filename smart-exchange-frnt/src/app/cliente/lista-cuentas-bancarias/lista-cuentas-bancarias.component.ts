import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
import { BancosService } from 'src/app/rest/bancos.service';
import * as Const from 'src/app/utils/constants.service'
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';

interface CuentaBancariaResponse{
  id: number;
  tipoCuenta: number;
  moneda: number;
  banco: number;
  numeroCuenta: number;
  nombre: string;
  estado: number
}

@Component({
  selector: 'app-lista-cuentas-bancarias',
  templateUrl: './lista-cuentas-bancarias.component.html',
  styleUrls: ['./lista-cuentas-bancarias.component.sass']
})
export class ListaCuentasBancariasComponent implements OnInit {
  monedas: any[]=Const.CUENTA_MONEDAS_CLIENTE
  estaCargando: boolean = false
  dataSource: CuentaBancariaResponse[] = [];
  bancos: any[] = [];
  displayedColumns: string[] = ['tipoCuenta', 'moneda','banco', 'numeroCuenta', 'nombre','estado','opciones'];

  constructor(
    private dialog: MatDialog,
    private restBancos: BancosService,
    private notif: NotifierService,
    ){
    }
    
  ngOnInit(): void {
    this.recuperaCuentasBancarias();
  }

  recuperaCuentasBancarias():void{
    this.restBancos.recuperaCuentasBancarias().subscribe({
      next: (response:any) => {
        console.warn(response)
        this.dataSource = response as CuentaBancariaResponse[]
      },
      error: (error:any) => {
      }
    });
  }

  recuperaNombre(codig:number):string{
    const item = this.monedas.find(elemento => elemento.codigo == codig);
    return item ? item.nombre : '';
  }

  agregaCuentasBancarias(){
    const dialogRef = this.dialog.open(CuentasBancariasComponent)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaCuentasBancarias()
      }
    })
  }
}
