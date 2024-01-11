import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { DatosCompartidosService, Notificacion } from '../servicios/datos-compartidos.service';
import { MatDialog, MatDialogConfig,MatDialogRef } from "@angular/material/dialog"
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import { OperacionService, PaginaOperacionResponse, OperacionResponse } from '../rest/operacion.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'
import {PageEvent} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { UsuariosService, UsuarioResponse, ClienteResponse } from '../rest/usuarios.service';
import { CuentaBancariaResponse } from '../rest/bancos.service';
import { DetallesComponent } from '../ui-utils/detalles/detalles.component';
import { ImagenComponent } from '../ui-utils/imagen/imagen.component';
import { CargaComprobanteComponent } from '../cliente/carga-comprobante/carga-comprobante.component';
import { TokenService } from '../servicios/token.service';
import { ConfirmacionComponent } from '../ui-utils/confirmacion/confirmacion.component';
import { PromptComponent } from '../ui-utils/prompt/prompt.component';
import { PrompSelecComponent, Item } from '../ui-utils/promp-selec/promp-selec.component';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.sass']
})

export class OperacionesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  operadores: UsuarioResponse[] = []
  operadoresSelect: any[] = []
  estaCargando: boolean = false
  showFirstLastButtons = true;
  criterioForm: FormGroup;
  dataSource: OperacionResponse[] = [];
  displayColumns: string[] = ['fechaCreacion','ticket','estado', 'tipoTransferencia','monto', 'montoFinal','codigoTransferencia','cliente','origen','destino','transferencia','operador','opciones'];
  filasInicial: number=5
  paginaInicial: number=0
  paginaActual : PaginaOperacionResponse = {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    size: this.filasInicial,
    totalElements: 0,
    totalPages: 0
  };
  hoy = new Date();
  fechaFormateada = this.hoy.toISOString().split('T')[0];
  constructor(
    private datosCompartidos: DatosCompartidosService,
    private dialog: MatDialog,
    private restOperacion:OperacionService,
    private notif: NotifierService,
    private formBuilder: FormBuilder,
    private bottomSheet: MatBottomSheet,
    private restUsuarios: UsuariosService,
    private tokenService: TokenService
    ){
      this.criterioForm = this.formBuilder.group({
        inicio: ['', Validators.required],
        fin: ['', Validators.required],
        nombres: [''],
        nroDocumento: [''],
        ticket: [''],
        operador: [0],
      });
    }

  ngOnInit(): void {
    this.recuperaInicial();
    this.recuperaOperadores();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.recuperaOperacionesPaginado(pageEvent.pageIndex, pageEvent.pageSize);
    });
  }

  recuperaUsuarioToken():string{
    return this.tokenService.recuperaUsuario()
  }

  recuperarComprobante(operacionId:number):void{
    this.estaCargando = true
    this.restOperacion.recuperaComprobante(operacionId).subscribe({
      next: (response:any) => {
        this.estaCargando = false
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          base64:response
        } 
        const dialogRef = this.dialog.open(ImagenComponent, dialogConfig)
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            ///this.recuperaCuentasBancarias()
          }
        })
      },
      error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
      }
    });
  }

  cargarComprobante(id:number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      operacionId : id
    } 
    const dialogRef = this.dialog.open(CargaComprobanteComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaOperacionesPaginado(this.paginaActual.number, this.paginaActual.size);
      }
    })
  }

  recuperaOperadores(){
    this.restUsuarios.recuperaOperadores().subscribe({
      next: (response:UsuarioResponse[]) => {
        this.operadores = response
        this.operadoresSelect.push({id: 0, usuario:'Todos'})
        this.operadores.forEach((item)=>{
          this.operadoresSelect.push({id:item.id, usuario: item.usuario})
        })
      },
      error: (error:any) => {
        this.notif.notify('error', error);
      }
    });
  }

  resetForm(){
    this.criterioForm.setValue({
      inicio: this.fechaFormateada,
      fin: this.fechaFormateada,
      nombres:'',
      nroDocumento:'',
      ticket:'',
      operador : 0
    });
  }

  recuperaOperacionesPaginado(pagina:number, filas:number ){
    this.estaCargando=true
    const valoresFormulario = this.criterioForm.value;
    let datos={
      inicio: new Date(valoresFormulario.inicio).toISOString().split('T')[0],
      fin: new Date(valoresFormulario.fin).toISOString().split('T')[0],
      nombres: valoresFormulario.nombres,
      nroDocumento: valoresFormulario.nroDocumento,
      ticket: valoresFormulario.ticket,
      operador: valoresFormulario.operador
    }
    this.restOperacion.recuperaOperacionesPaginado(pagina, filas, datos).subscribe({
      next: (response:PaginaOperacionResponse) => {
        this.dataSource = response.content
        this.paginaActual = response
        this.estaCargando=false
      },
      error: (error:any) => {
        this.notif.notify('error', error);
        this.estaCargando=false
      }
    });
  }

  abrirDetalles(opc:number, data: CuentaBancariaResponse|ClienteResponse): void {
    const bottomSheetConfig = new MatBottomSheetConfig();
    bottomSheetConfig.data = {
      opc: opc,
      datos: data
    }
    this.bottomSheet.open(DetallesComponent, bottomSheetConfig);
  }

  abreReasignacion(id:number):void{
    const dialogConfig = new MatDialogConfig();
    let items: Item[] = []
    this.operadores.forEach(item => {
      items.push({codigo: item.id, nombre: item.usuario});
    });
    dialogConfig.data = {
      texto: 'Seleccione un operador',
      datos: items
    }
    const dialogRef = this.dialog.open(PrompSelecComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.estaCargando = true
        this.restOperacion.reasignaOperador(id, result).subscribe({
          next: (response:any) => {
            this.recuperaOperacionesPaginado(this.paginaActual.number, this.paginaActual.size);
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

  finalizaOperacion(id:number):void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      texto: 'Ingrese el código de transferencia',
      label: 'Cod. de transferencia'
    }
    const dialogRef = this.dialog.open(PromptComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result){
        this.estaCargando = true
        this.restOperacion.finalizaOperacion(id, result).subscribe({
          next: (response:any) => {
            this.recuperaOperacionesPaginado(this.paginaActual.number, this.paginaActual.size);
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

  mostrarReasignar(estado:number):boolean{
    return estado==Const.OP_ACTIVO || estado==Const.OP_EN_CURSO || estado==Const.OP_PRELIMINAR
  }

  mostrarEnCurso(estado:number):boolean{
    return estado==Const.OP_ACTIVO
  }

  estaAsignadoATi(operador:string):boolean{
    return this.recuperaUsuarioToken()==operador
  }

  mostrarAnular(estado:number){
    return estado==Const.OP_ACTIVO || estado==Const.OP_PRELIMINAR || estado==Const.OP_EN_CURSO
  }

  mostrarFinalizar(estado:number){
    return estado==Const.OP_EN_CURSO
  }
  mostrarReactivar(estado:number){
    return estado==Const.OP_ANULADO
  }

  accionOperador(id:number, ticket:string, estado:number):void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titulo: 'CONFIRME',
      descripcion:`Está seguro de cambiar el estado a ${this.buscarNombreDeEstado(estado)} a la operación ${ticket}`
    } 
    const dialogRef = this.dialog.open(ConfirmacionComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.estaCargando = true
        this.restOperacion.accionesOperador(id, estado).subscribe({
          next: (response:any) => {
            this.recuperaOperacionesPaginado(this.paginaActual.number, this.paginaActual.size);
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

  recuperaInicial(){
    this.resetForm()
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

  buscar():void{
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

  buscarNombreDeEstado(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.ESTADOS_OPERACION);
  }
  buscarNombreDeTransferencia(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.TIPO_TRANSFERENCIAS);
  }
  buscarNombreDeMoneda(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.CUENTA_MONEDAS_CLIENTE);
  }
}
