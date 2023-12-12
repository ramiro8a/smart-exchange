import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'
import { NotifierService } from 'angular-notifier';
import { BancosService } from 'src/app/rest/bancos.service';
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';
import { DatosCompartidosService, Notificacion } from 'src/app/servicios/datos-compartidos.service'; 
import { UtilsService } from 'src/app/rest/utils.service';

interface Cambio {
  monto: number;
  cambiado: number;
  tipoCambioId: number;
  origen:Detalle,
  destino:Detalle
}

interface Detalle {
  moneda: number;
  bancoId?: number;
  cuentaId?: number;
}

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.sass']
})
export class OperacionComponent implements OnInit{
  notificaciones: Notificacion[] = []
  cambio:Cambio
  estaCargando: boolean = false
  bancosOrigen: any[] = []
  bancosDestino: any[] = []
  cuentas: any[] = []
  cuentasOrigen: any[] = []
  cuentasOrigenActual: any[] = []
  cuentasDestino: any[] = []
  cuentasDestinoActual: any[] = []
  tipoCuentas: any[] = Const.TIPO_CUENTAS
  monedas: any[] = Const.CUENTA_MONEDAS_CLIENTE
  tipoDocumentos: any[] = Const.TIPO_DOCUMENTOS
  cuentasFormGroup = this.formBuilder.group({
    bancoOrigen: ['', [Validators.required]],
    cuentaOrigen: ['', [Validators.required]],
    bancoDestino: ['', [Validators.required]],
    cuentaDestino: ['', [Validators.required]],
  });
  personalForm = this.formBuilder.group({
    tipoDocumento: [1, [Validators.required]],
    nroDocumento: ['', [Validators.required]],
    nombres: ['', Validators.required],
    /* sNombre: [''], */
    paterno: ['', Validators.required],
    materno: [''],
    celular: [''],
    deAcuerdo: [false, [Validators.required]]
  });
  isEditable = true;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CuentasBancariasComponent>,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    private restBancos: BancosService,
    private datosCompartidos: DatosCompartidosService,
    private restUtils: UtilsService,
    @Inject(MAT_DIALOG_DATA) data:Cambio
  ){
    this.cambio = data
    console.warn(this.cambio)
  }

  ngOnInit(): void {
    this.recuperaCuentasRegistradas();
    this.recuperaNotificaciones()
    this.datosCompartidos.notificaciones$.subscribe(notificaciones => {
      this.notificaciones = notificaciones;
    });

    this.cuentasFormGroup.controls.bancoOrigen.valueChanges.subscribe(data=>{
      this.cuentasOrigenActual = []
      this.cuentasOrigen.forEach(element => {
        if (element.banco===data) {
          this.cuentasOrigenActual.push(element)
        }
      })
    })
    this.cuentasFormGroup.controls.bancoDestino.valueChanges.subscribe(data=>{
      this.cuentasDestinoActual = []
      this.cuentasDestino.forEach(element => {
        if (element.banco===data) {
          this.cuentasDestinoActual.push(element)
        }
      })
    })
  }

  recuperaNotificaciones():void{
    this.restUtils.recuperaNotificaciones().subscribe({
      next: (response:any) => {
        this.datosCompartidos.actualizarNotificaciones(response as Notificacion[]);
      },
      error: (error:any) => {
      }
    });
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

  agregaCuentasBancarias(){
    const dialogRef = this.dialog.open(CuentasBancariasComponent)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaCuentasRegistradas()
      }
    })
  }

  recuperaCuentasRegistradas():void{
    this.estaCargando = true
    this.restBancos.recuperaCuentasRegistradas(this.cambio.origen.moneda, this.cambio.destino.moneda).subscribe({
      next: (response:any) => {
        this.bancosOrigen = response.bancosOrigen
        this.bancosDestino = response.bancosDestino
        this.cuentasOrigen = response.cuentasOrigen
        this.cuentasDestino = response.cuentasDestino
        this.estaCargando = false
      },
      error: (error:any) => {
        this.estaCargando = false
      }
    });
  }

  descripcionOrigenMoneda():string{
    return this.cambio.origen.moneda===Const.USD_ISO?'en dólares':'en soles';
  }

  descripcionDestinoMoneda():string{
    return this.cambio.destino.moneda===Const.USD_ISO?'en dólares':'en soles';
  }

  recuperaNombre(codig:number):string{
    const item = this.monedas.find(elemento => elemento.codigo == codig);
    return item ? item.nombre : '';
  }

  estaDeAcuerdo():boolean{
    return this.personalForm.get('deAcuerdo')?.value?true:false
  }
  esPersona():boolean{
    return this.personalForm.get('tipoDocumento')?.value != 2
  }
  pedirDatospersonales():boolean{
    const item = this.notificaciones.find(elemento => elemento.metodo == 'datosPersonales');
    return item?true:false
  }

}
