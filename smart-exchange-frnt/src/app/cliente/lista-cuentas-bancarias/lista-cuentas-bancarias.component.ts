import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
import { BancosService, CuentaBancariaResponse } from 'src/app/rest/bancos.service';
import * as Const from 'src/app/utils/constants.service'
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-lista-cuentas-bancarias',
  templateUrl: './lista-cuentas-bancarias.component.html',
  styleUrls: ['./lista-cuentas-bancarias.component.sass']
})
export class ListaCuentasBancariasComponent implements OnInit {
  monedas: any[]=Const.CUENTA_MONEDAS_CLIENTE
  estaCargando: boolean = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //dataSource: CuentaBancariaResponse[] = [];
  dataSource = new MatTableDataSource<CuentaBancariaResponse>()
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  recuperaCuentasBancarias():void{
    this.estaCargando = true
    this.restBancos.recuperaCuentasBancarias().subscribe({
      next: (response:CuentaBancariaResponse[]) => {
        response.forEach(element => {
          element.activo = element.estado==0
        });
        this.dataSource = new MatTableDataSource(response); 
        this.dataSource.paginator = this.paginator;
        this.estaCargando = false
      },
      error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
      }
    });
  }

  cambioEstado(cuenta: CuentaBancariaResponse):void {
    let activo = cuenta.activo?true:false
    this.estaCargando = true
    this.restBancos.habilitaDeshabilitaCuenta(cuenta.id, activo).subscribe({
      next: (response:any) => {
        this.estaCargando = false
      },
      error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
        cuenta.activo = !activo
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

  buscarNombreDeTipoCuenta(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.TIPO_CUENTAS);
  }

  editar(cuenta: CuentaBancariaResponse){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = cuenta
    const dialogRef = this.dialog.open(CuentasBancariasComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaCuentasBancarias()
      }
    })
  }
}
