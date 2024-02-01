import { Component, OnInit } from '@angular/core';
import { TokenService } from '../servicios/token.service';
import { UtilsService } from '../rest/utils.service';
import { DatosCompartidosService, Notificacion } from '../servicios/datos-compartidos.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { DatosPersonalesComponent } from '../cliente/datos-personales/datos-personales.component';
import { SocketService } from '../servicios/socket.service';
import { Router } from '@angular/router';
import { AdvertenciaComponent } from '../ui-utils/advertencia/advertencia.component';
import { CambioPasswordComponent } from '../ui-utils/cambio-password/cambio-password.component';

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
    private socket: SocketService,
    private router: Router,
    ){
    }

  ngOnInit(): void {
    this.datosCompartidos.notificaciones$.subscribe(notificaciones => {
      this.notificaciones = notificaciones;
    });
    if(this.tokenService.esOperador()){
      this.socket.joinRoom("OPERADOR");
    }
    if(this.tokenService.esCliente()){
      this.recuperaNotificaciones()
    }
  }


/*   escuchaNotificaciones() {
    this.socket.getMessageSubject().subscribe((messages: any) => {
      console.warn(messages)
    });
  } */

  recuperaNotificaciones():void{
    this.restUtils.recuperaNotificaciones().subscribe({
      next: (response:any) => {
        this.datosCompartidos.actualizarNotificaciones(response as Notificacion[]);
        if(this.pedirDatospersonales()){
          this.datosPersonales()
        }
        if(this.verificaOrarioAtencion()){
          const notificac = this.recuperaOrarioAtencionLocal();
          this.horarioAtencionCliente(notificac!.valor)
        }
      },
      error: (error:any) => {
      }
    });
  }

  ejecutarMetodo(nombreMetodo: string, valor:string) {
    console.error(`método '${nombreMetodo}' valor '${valor}'`);
    const metodo = (this as any)[nombreMetodo];
    if (nombreMetodo=='horarioAtencion') {
      this.horarioAtencionCliente(valor)
    }
    if (typeof metodo == 'function') {
      metodo.bind(this)();
    }
    if (nombreMetodo=='validaDatosCliente') {
      this.validaDatosClienteMetodo(valor)
    }
  }

  horarioAtencionCliente(mensaje:string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titulo: 'Horario de atención',
      descripcion: mensaje
    }
    dialogConfig.width='30em'
    const dialogRef = this.dialog.open(AdvertenciaComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //
      }
    })
  }

  cambioPassword(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(CambioPasswordComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
      }
    })
  }


  validaDatosClienteMetodo(clientId:string){
    //this.router.navigate([`/operaciones/clientes`, clientId])
    this.router.navigate([`/operaciones/clientes/${clientId}`])
/*     const dialogConfig = new MatDialogConfig();
    dialogConfig.data =Number(clientId)
    const dialogRef = this.dialog.open(ValidaClienteComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaNotificaciones()
      }
    }) */
  }

  verificaOrarioAtencion():boolean{
    const item = this.notificaciones.find(elemento => elemento.metodo == 'horarioAtencion');
    return item?true:false
  }

  recuperaOrarioAtencionLocal():Notificacion | undefined{
    return this.notificaciones.find(elemento => elemento.metodo == 'horarioAtencion');
  }

  pedirDatospersonales():boolean{
    const item = this.notificaciones.find(elemento => elemento.metodo == 'datosPersonales');
    return item?true:false
  }

  datosPersonales(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {nuevo: true}
    dialogConfig.panelClass='datos-personales-dialog'
    const dialogRef = this.dialog.open(DatosPersonalesComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaNotificaciones()
      }
    })
  }

  recuperaUsuario():string{
    return this.tokenService.recuperaUsuario();
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
