import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig,MatDialogRef } from "@angular/material/dialog"
import { UsuariosService, ClienteResponse } from 'src/app/rest/usuarios.service';
import * as Const from 'src/app/utils/constants.service'
import { ConfirmacionComponent } from 'src/app/ui-utils/confirmacion/confirmacion.component';
import { NotifierService } from 'angular-notifier';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from "@angular/router";
import { DatosCompartidosService } from 'src/app/servicios/datos-compartidos.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.sass']
})
export class ClientesComponent implements OnInit{
  tipoDocumentos=Const.TIPO_DOCUMENTOS
  tipoBusquedas=Const.TIPO_BUSQUEDAS_CLIENTES
  estaCargando: boolean = false
  dataSource: ClienteResponse[] = [];
  displayColumns: string[] = ['fechaCreacion','nombres','paterno', 'materno','documento', 'telefono','estado', 'opciones'];
  busquedaFormGroup = this.formBuilder.group({
    tipoBusqueda: [1, [Validators.required]],
    valor: ['',],
    desde: ['', ],
    hasta: ['', ],
  });
  constructor(
    private restUsuarios: UsuariosService,
    private dialog: MatDialog,
    private notif: NotifierService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private datosCompartidos: DatosCompartidosService
    ){
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let nroDocumento = params['nroDocumento'];
      if(nroDocumento==='todo'){
        this.recuperaClientesInicial()
      }else{
        this.recuperaClientes(3, nroDocumento, 0, 5);
        this.datosCompartidos.eliminarNotificacionPorValor(nroDocumento);
      }
    });
    this.busquedaFormGroup.get('tipoBusqueda')?.valueChanges.subscribe((tipoDocumento) => {
      if(tipoDocumento===1){
        this.busquedaFormGroup.get('valor')?.setValue('')
        this.busquedaFormGroup.controls['valor'].setValidators([]);
      }else{
        this.busquedaFormGroup.controls['valor'].setValidators([Validators.required]);
      }
      this.busquedaFormGroup.controls['valor'].updateValueAndValidity();
    });
  }

  buscar(){
    if(this.busquedaFormGroup.get('tipoBusqueda')?.value===1){
      this.recuperaClientesInicial()
    } else {
      if(this.busquedaFormGroup.valid){
        let tipo = this.busquedaFormGroup.get('tipoBusqueda')?.value
        let valor = this.busquedaFormGroup.get('valor')?.value
        this.recuperaClientes(tipo as number, valor as string, 0, 5);
      }else{
        this.notif.notify('warning','Complete el formulario por favor');
      }
    }
  }

  cambiarEstado(cliente: ClienteResponse, nuevoEstado: boolean):void{
    if(nuevoEstado){
      cliente.estado==0
    }else{
      cliente.estado==2
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titulo: 'CONFIRME',
      descripcion:`Esta seguro cambiar estado a ${this.habilitado(cliente.estado)?'DESHABILITADO':'HABILITADO'} al cliente: ${cliente.nombres} ${cliente.paterno}`
    } 
    const dialogRef = this.dialog.open(ConfirmacionComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.estaCargando = true
        this.restUsuarios.cambiaEstado(cliente.id).subscribe({next: (response:any) => {
            this.estaCargando = false
          },
          error: (error:any) => {
            cliente.estado = cliente.estado==0?2:0
            this.notif.notify('error',error);
            this.estaCargando = false
          }
        });
      }else{
        cliente.estado = cliente.estado==0?2:0
      }
    })
  }

  validarCliente(cliente: ClienteResponse):void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titulo: 'CONFIRME',
      descripcion:`Confirma que los datos del cliente ${cliente.nombres} ${cliente.paterno} ${cliente.validado?'NO SON CORRECTOS':'SON CORRECTOS'} `
    } 
    const dialogRef = this.dialog.open(ConfirmacionComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.estaCargando = true
        this.restUsuarios.validaCliente(cliente.id).subscribe({next: (response:any) => {
            cliente.validado = !cliente.validado
            this.estaCargando = false
          },
          error: (error:any) => {
            this.notif.notify('error',error);
            this.estaCargando = false
          }
        });
      }
    })
  }

  recuperaClientes(tipo:number, valor: string, pagina:number, tamano:number):void{
    this.estaCargando = true
    this.restUsuarios.recuperaClientes(tipo, valor, pagina, tamano).subscribe({
      next: (response:ClienteResponse[]) => {
        this.dataSource = response
        this.estaCargando = false
      }, error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
      }
    });
  }

  recuperaClientesInicial(){
    this.busquedaFormGroup.get('tipoBusqueda')?.setValue(1)
    this.recuperaClientes(1,'TODO', 0, 5)
  }

  recuperaAbrevDoc(codig:number):string{
    const item = this.tipoDocumentos.find(elemento => elemento.codigo == codig);
    return item ? item.abrev : '';
  }

  habilitado(valor:number):boolean{
    return valor==0
  }


}
