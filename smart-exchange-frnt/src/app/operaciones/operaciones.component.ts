import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { DatosCompartidosService, Notificacion } from '../servicios/datos-compartidos.service';
import { MatDialog, MatDialogConfig,MatDialogRef } from "@angular/material/dialog"
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import { OperacionService, PaginaOperacionResponse, OperacionResponse } from '../rest/operacion.service';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'
import {PageEvent} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.sass']
})

export class OperacionesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  estaCargando: boolean = false
  showFirstLastButtons = true;
  criterioForm: FormGroup;
  dataSource: OperacionResponse[] = [];
  displayColumns: string[] = ['fechaCreacion','ticket','estado', 'tipoTransferencia','monto', 'montoFinal','codigoTransferencia','cliente','origen','destino','transferencia','operador','opciones'];
  paginable: any
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
    private bottomSheet: MatBottomSheet
    ){
      this.criterioForm = this.formBuilder.group({
        inicio: ['', Validators.required],
        fin: ['', Validators.required],
        nombres: [''],
        paterno: [''],
        nroDocumento: [''],
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

  resetForm(){
    this.criterioForm.setValue({
      inicio: this.fechaFormateada,
      fin: this.fechaFormateada,
      nombres:'',
      paterno:'',
      nroDocumento:'',
      ticket:''
    });
  }

  recuperaOperacionesPaginado(pagina:number, filas:number ){
    this.estaCargando=true
    const valoresFormulario = this.criterioForm.value;
    let datos={
      inicio: new Date(valoresFormulario.inicio).toISOString().split('T')[0],
      fin: new Date(valoresFormulario.fin).toISOString().split('T')[0],
      nombres: valoresFormulario.nombres,
      paterno: valoresFormulario.paterno,
      nroDocumento: valoresFormulario.nroDocumento,
      ticket: valoresFormulario.ticket
    }
    this.restOperacion.recuperaOperacionesPaginado(pagina, filas, datos).subscribe({
      next: (response:PaginaOperacionResponse) => {
        this.dataSource = response.content
        this.paginable = response
        this.estaCargando=false
      },
      error: (error:any) => {
        this.notif.notify('error', error);
        this.estaCargando=false
      }
    });
  }

  recuperaInicial(){
    this.resetForm()
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

  buscar():void{
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }
}
