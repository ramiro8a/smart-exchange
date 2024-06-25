import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosCompartidosService } from '../servicios/datos-compartidos.service';
import { MatDialog } from '@angular/material/dialog';
import { OperacionResponse, OperacionService, PaginaOperacionResponse, ReporteOperacion } from '../rest/operacion.service';
import { NotifierService } from 'angular-notifier';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UsuarioResponse, UsuariosService } from '../rest/usuarios.service';
import { TokenService } from '../servicios/token.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as Const from 'src/app/utils/constants.service'
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.sass']
})
export class ReportesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  operadores: UsuarioResponse[] = []
  operadoresSelect: any[] = []
  estaCargando: boolean = false
  showFirstLastButtons = true;
  criterioForm: FormGroup;
  dataSource: OperacionResponse[] = [];
  displayColumns: string[] = ['fechaCreacion','estado','monto', 'montoFinal','codigoTransferencia','codigoTransferenciaEmpresa','cliente','origen','destino','transferencia','operador'];
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
  estados:any[]=[]

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
        operador: [0],
        estado: [100],
      });
    }

  ngOnInit(): void {
    this.llenaEstados()
    this.recuperaInicial();
    this.recuperaOperadores();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.recuperaOperacionesPaginado(pageEvent.pageIndex, pageEvent.pageSize);
    });
  }

  descargarExcel(){
    if(this.dataSource.length===0){
      this.notif.notify('warning', 'No hay datos para descargar');
      return
    }

    this.estaCargando=true
    const valoresFormulario = this.criterioForm.value;
    let datos={
      inicio: new Date(valoresFormulario.inicio).toISOString().split('T')[0],
      fin: new Date(valoresFormulario.fin).toISOString().split('T')[0],
      operador: valoresFormulario.operador,
      estado: valoresFormulario.estado
    }
    this.restOperacion.recuperaReporteOperacionesPaginado(0, this.paginaActual.totalElements, datos).subscribe({
      next: (response:ReporteOperacion[]) => {
        const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(response);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
        XLSX.writeFile(wb, 'ReporteOperaciones.xlsx');
        this.estaCargando=false
      },
      error: (error:any) => {
        this.notif.notify('error', error);
        this.estaCargando=false
      }
    });
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
      operador : 0,
      estado: 100
    });
  }

  recuperaInicial(){
    this.resetForm()
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

  llenaEstados(){
    this.estados=[]
    this.estados.push({codigo: 100, nombre: 'Todos'})
    Const.ESTADOS_OPERACION_RES.forEach((item)=>{
      this.estados.push({codigo: item.codigo, nombre: item.nombre})
    })
  }

  buscar():void{
    this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
  }

  recuperaOperacionesPaginado(pagina:number, filas:number ){
    this.estaCargando=true
    const valoresFormulario = this.criterioForm.value;
    let datos={
      inicio: new Date(valoresFormulario.inicio).toISOString().split('T')[0],
      fin: new Date(valoresFormulario.fin).toISOString().split('T')[0],
      operador: valoresFormulario.operador,
      estado: valoresFormulario.estado
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

  buscarClasePorCodigo(codigo:number, envioSunat:boolean):string{
    if(Const.OP_FINALIZADO==codigo && !envioSunat){
      return 'op-est-finalizado-sin-sunat'
    }
    return Const.buscarClassPorCodigo(codigo, Const.ESTADOS_OPERACION);
  }

  buscarNombreDeEstado(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.ESTADOS_OPERACION);
  }

  buscarNombreDeMoneda(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.CUENTA_MONEDAS_CLIENTE);
  }

}
