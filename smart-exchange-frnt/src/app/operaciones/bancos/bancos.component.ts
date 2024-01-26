import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
import * as Const from 'src/app/utils/constants.service'
import { BancosService, Banco } from 'src/app/rest/bancos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PromptComponent } from 'src/app/ui-utils/prompt/prompt.component';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.sass']
})
export class BancosComponent implements OnInit{
  //dataSource: Banco[] = [];
  dataSource = new MatTableDataSource<Banco>()
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  estaCargando:boolean = false
  displayedColumns: string[] = ['nombre','estado'];
  //displayedColumns: string[] = ['nombre','estado','opciones'];

  constructor(
    private restBancos: BancosService,
    private notif: NotifierService,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.recupertaBancos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  recupertaBancos():void{
    this.restBancos.recuperaBancosTodos().subscribe({
      next: (response:any) => {
        response.forEach((element:any) => {
          element.activo = element.estado==0
        });
        this.dataSource = new MatTableDataSource(response as Banco[]); 
        this.dataSource.paginator = this.paginator;
      },
      error: (error:any) => {
        this.notif.notify('error', error);
      }
    });
  }

  agregarBanco():void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      texto: 'Nuevo Banco',
      label: 'Nombre',
      tipoInput: 'text'
    }
    const dialogRef = this.dialog.open(PromptComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.estaCargando = true
         this.restBancos.creaBanco({nombre: result}).subscribe({
          next: (response:any) => {
            this.estaCargando = false
            this.recupertaBancos();
          },
          error: (error:any) => {
            this.notif.notify('error',error);
            this.estaCargando = false
          }
        });
      }
    })
  }

  cambioEstado(cuenta: Banco):void {
    let activo = cuenta.activo?true:false
    this.estaCargando = true
    this.restBancos.habilitaDeshabilitaBanco(cuenta.id, activo).subscribe({
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

  editar(cuenta: Banco):void {
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

}
