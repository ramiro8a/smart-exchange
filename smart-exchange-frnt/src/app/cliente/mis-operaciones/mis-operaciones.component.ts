import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig,MatDialogRef } from "@angular/material/dialog"
import { OperacionService, PaginaOperacionResponse, OperacionResponse } from 'src/app/rest/operacion.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import { DetallesComponent } from 'src/app/ui-utils/detalles/detalles.component';
import { CuentaBancariaResponse } from 'src/app/rest/bancos.service';
import {PageEvent} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { CargaComprobanteComponent } from '../carga-comprobante/carga-comprobante.component';

@Component({
  selector: 'app-mis-operaciones',
  templateUrl: './mis-operaciones.component.html',
  styleUrls: ['./mis-operaciones.component.sass']
})
export class MisOperacionesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  estaCargando: boolean = false
  showFirstLastButtons = true;
  criterioForm: FormGroup;
  dataSource: OperacionResponse[] = [];
  displayColumns: string[] = ['fechaCreacion','ticket','estado', 'tipoTransferencia','monto', 'montoFinal','codigoTransferencia','origen','destino','transferencia'];
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
    private dialog: MatDialog,
    private restOperacion:OperacionService,
    private notif: NotifierService,
    private formBuilder: FormBuilder,
    private bottomSheet: MatBottomSheet
    ){
      this.criterioForm = this.formBuilder.group({
        inicio: ['', Validators.required],
        fin: ['', Validators.required],
        ticket: [''],
      });
    }

  ngOnInit(): void {
    this.recuperaInicial();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.recuperaOperacionesPaginado(pageEvent.pageIndex, pageEvent.pageSize);
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

  abrirDetalles(opc:number, data: CuentaBancariaResponse): void {
    const bottomSheetConfig = new MatBottomSheetConfig();
    bottomSheetConfig.data = {
      opc: opc,
      datos: data
    }
    this.bottomSheet.open(DetallesComponent, bottomSheetConfig);
  }

  resetForm(){
    this.criterioForm.setValue({
      inicio: this.fechaFormateada,
      fin: this.fechaFormateada,
      ticket:''
    });
  }
  recuperaInicial(){
    this.resetForm()
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

  recuperaOperacionesPaginado(pagina:number, filas:number ){
    this.estaCargando=true
    const valoresFormulario = this.criterioForm.value;
    let datos={
      inicio: new Date(valoresFormulario.inicio).toISOString().split('T')[0],
      fin: new Date(valoresFormulario.fin).toISOString().split('T')[0],
      ticket: valoresFormulario.ticket
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
