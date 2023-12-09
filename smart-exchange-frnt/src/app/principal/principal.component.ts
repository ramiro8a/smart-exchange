import { Component, OnInit } from '@angular/core';
import { TokenService } from '../servicios/token.service';
import { UtilsService } from '../rest/utils.service';
import { DatosCompartidosService, Notificacion } from '../servicios/datos-compartidos.service';
import { MatDialog, MatDialogConfig,MatDialogRef } from "@angular/material/dialog"
import { DatosPersonalesComponent } from '../cliente/datos-personales/datos-personales.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.sass']
})
export class PrincipalComponent implements OnInit{
  notificaciones: Notificacion[] = []
  constructor(
    private tokenService: TokenService,
    private restUtils: UtilsService,
    private datosCompartidos: DatosCompartidosService,
    private dialog: MatDialog,
    ){}

  ngOnInit(): void {
    if(this.tokenService.esCliente()){
      this.recuperaNotificaciones()
      this.datosCompartidos.notificaciones$.subscribe(notificaciones => {
        this.notificaciones = notificaciones;
      });
    }
  }

  recuperaNotificaciones():void{
    this.restUtils.recuperaNotificaciones().subscribe({
      next: (response:any) => {
        this.datosCompartidos.actualizarNotificaciones(response as Notificacion[]);
        if(this.pedirDatospersonales()){
          this.datosPersonales()
        }
      },
      error: (error:any) => {
      }
    });
  }

  ejecutarMetodo(nombreMetodo: string) {
    const metodo = (this as any)[nombreMetodo];
    if (typeof metodo == 'function') {
      metodo.bind(this)();
    } else {
      console.error(`No existe un método llamado '${nombreMetodo}'`);
    }
  }

  pedirDatospersonales():boolean{
    const item = this.notificaciones.find(elemento => elemento.metodo == 'datosPersonales');
    return item?true:false
  }

  datosPersonales(){
    const dialogRef = this.dialog.open(DatosPersonalesComponent)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaNotificaciones()
      }
    })
  }

  esCliente():boolean{
    return this.tokenService.esCliente();
  }
  esAdmin():boolean{
    return this.tokenService.esAdmin();
  }
  esOperador():boolean{
    return this.tokenService.esOperador();
  }
  esGerente():boolean{
    return this.tokenService.esGerente();
  }
}
