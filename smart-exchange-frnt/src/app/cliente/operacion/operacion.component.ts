import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import * as Const from 'src/app/utils/constants.service'
import { NotifierService } from 'angular-notifier';
import { BancosService } from 'src/app/rest/bancos.service';
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';
import { DatosCompartidosService, Notificacion } from 'src/app/servicios/datos-compartidos.service'; 
import { UtilsService } from 'src/app/rest/utils.service';
import { ConfirmacionComponent } from 'src/app/ui-utils/confirmacion/confirmacion.component';
import { OperacionService } from 'src/app/rest/operacion.service';
import { UsuariosService } from 'src/app/rest/usuarios.service';
import { CamaraComponent } from 'src/app/ui-utils/camara/camara.component';

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
  pasoIds = {
    personal: 'personal',
    cuentas: 'cuentas',
    transferencia: 'transferencia',
    finalizar: 'finalizar'
  };
  imagen={
    captura: false,
    carga:false
  }
  operacionId:number=0
  stepper:any={}
  cuentaTransferencia: any
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
  transferenciaForm = this.formBuilder.group({
    transferido: [false, [Validators.required]]
  });
  finalizaForm = this.formBuilder.group({
    codigoTransferencia: ['', [Validators.required]],
    comprobante: ['', [Validators.required]],
    noTiene: [false]
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
    private restOperacion: OperacionService,
    private restUsuario: UsuariosService,
    @Inject(MAT_DIALOG_DATA) data:Cambio
  ){
    this.cambio = data
  }

  ngOnInit(): void {
    this.recuperaCuentasRegistradas();
    this.recuperaNotificaciones()
    this.datosCompartidos.notificaciones$.subscribe(notificaciones => {
      this.notificaciones = notificaciones;
    });

    this.cuentasFormGroup.controls.bancoOrigen.valueChanges.subscribe(data=>{
      this.cuentasOrigenActual = []
      this.cuentaTransferencia = null
      this.cuentasFormGroup.controls['cuentaOrigen'].setValue('');
      this.cambio.origen.bancoId = Number(data)
      this.cuentasOrigen.forEach(element => {
        if (element.banco===data) {
          this.cuentasOrigenActual.push(element)
        }
      })
    })
    this.cuentasFormGroup.controls.bancoDestino.valueChanges.subscribe(data=>{
      this.cuentasDestinoActual = []
      this.cambio.destino.bancoId = Number(data)
      this.cuentasFormGroup.controls['cuentaDestino'].setValue('');
      this.cuentasDestino.forEach(element => {
        if (element.banco===data) {
          this.cuentasDestinoActual.push(element)
        }
      })
    })
    this.personalForm.get('tipoDocumento')?.valueChanges.subscribe((tipoDocumento) => {
      if(tipoDocumento===2){
        this.personalForm.controls['paterno'].setValidators([]);
      }else{
        this.personalForm.controls['paterno'].setValidators([Validators.required]);
      }
      this.personalForm.controls['paterno'].updateValueAndValidity();
    });
    this.finalizaForm.get('noTiene')?.valueChanges.subscribe((noTiene) => {
      if(noTiene){
        this.finalizaForm.controls['codigoTransferencia'].setValidators([]);
      }else{
        this.finalizaForm.controls['codigoTransferencia'].setValidators([Validators.required]);
      }
      this.finalizaForm.controls['codigoTransferencia'].updateValueAndValidity();
    });
  }

  asignaComprobante(base64: string):void{
    this.finalizaForm.controls['comprobante'].setValue(base64);
  }

  archivoSeleccionado(event: any):void{
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          const base64 = e.target.result;
          this.asignaComprobante(base64)
          this.imagen = {
            captura: false,
            carga: true
          }
      };
      reader.readAsDataURL(file);
    }
  }

  abrirCamara():void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titulo: 'Tome una foto al comprobante',
      subtitulo: 'Asegurese de que la imagen sea nítida'
    } 
    const dialogRef = this.dialog.open(CamaraComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.asignaComprobante(result.base64)
        this.imagen = {
          captura: true,
          carga: false
        }
      }
    })
  }


  guardarFinalizar():void{
    if(this.finalizaForm.valid){
      let datos ={
        codigoTransferencia: this.finalizaForm.controls['codigoTransferencia'].value,
        comprobante: this.finalizaForm.controls['comprobante'].value,
      }
      this.estaCargando = true
      this.restOperacion.actualizaOperacion(this.operacionId, 2 ,datos).subscribe({next: (response:any) => {
          this.estaCargando = false
          this.close(true)
        },
        error: (error:any) => {
          this.notif.notify('error',error);
          this.estaCargando = false
        }
      });
    }else{
      this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  onStepChange(event: StepperSelectionEvent): void {
    let stepId = event.selectedStep.state;
    switch (stepId) {
      case this.pasoIds.personal:
        //this.metodoParaPersonal();
        break;
      case this.pasoIds.cuentas:
        //this.metodoParaCuentas();
        break;
      case this.pasoIds.transferencia:
        //this.recuperaCuentaLCExchange();
        break;
    }
  }


  guardaDatosPersonal(stepper:any):void{
    this.stepper = stepper
    if(this.personalForm.valid){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        titulo: 'CONFIRME',
        descripcion:'Los datos ingresados son los correctos y pueden ser validados por el sistema'
      } 
      const dialogRef = this.dialog.open(ConfirmacionComponent, dialogConfig)
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.restUsuario.registraDatosPersonalesCliente(this.personalForm.value).subscribe({next: (response:any) => {
              this.estaCargando = false
              this.stepper.next()
            },
            error: (error:any) => {
              this.notif.notify('error',error);
              this.estaCargando = false
            }
          });
        }
      })
    }else{
      this.notif.notify('warning','Complete el formulario con datos válidos por favor');
    }
  }
  
  recuperaCuentaLCExchange(stepper:any):void{
    this.stepper = stepper
    if(!this.cuentaTransferencia){
      if(this.cuentasFormGroup.valid){
        this.estaCargando = true
        this.restBancos.recuperaDestinoTransferencia(
          this.cambio.origen.bancoId,
          this.cambio.origen.moneda
        ).subscribe({next: (response:any) => {
            this.estaCargando = false
            this.cuentaTransferencia = response
            this.stepper.next()
          },
          error: (error:any) => {
            this.notif.notify('error',error);
            this.estaCargando = false
          }
        });
      }else{
        this.notif.notify('warning','Complete el formulario con datos válidos por favor');
      }
    }else{
      this.stepper.next()
    }
  }

  guardaTransferencia(stepper:any):void{
    this.stepper = stepper
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titulo: '¿Confirma que realizó la transferencia?',
      descripcion:'Si confirma, se generará una operación para que nuestros operadores la procesen.'
    } 
    const dialogRef = this.dialog.open(ConfirmacionComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.estaCargando = true
        let datos ={
          monto: this.cambio.monto,
          cuentaOrigenId: this.cuentasFormGroup.controls['cuentaOrigen'].value,
          cuentaDestinoId: this.cuentasFormGroup.controls['cuentaDestino'].value,
          cuentaTransferenciaId: this.cuentaTransferencia.id,
          tipoCambioId: this.cambio.tipoCambioId
        }
        this.restOperacion.creaOperacion(datos).subscribe({next: (response:number) => {
            this.estaCargando = false
            this.operacionId = response
            this.stepper.next()
          },
          error: (error:any) => {
            this.notif.notify('error',error);
            this.estaCargando = false
          }
        });
      }
    })
  }

  recuperaNotificaciones():void{
    this.estaCargando = true
    this.restUtils.recuperaNotificaciones().subscribe({
      next: (response:any) => {
        this.estaCargando = false
        this.datosCompartidos.actualizarNotificaciones(response as Notificacion[]);
      },
      error: (error:any) => {
        this.estaCargando = false
        //this.notif.notify('error',error);
      }
    });
  }

  close(data:boolean){
    if(data){
      this.notif.notify('success','Operación registrada con éxito, consulte MIS OPERACIONES para obtener más detalles');
    }
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

  recuperaNombreTipoCuentas(codig:number):string{
    const item = this.tipoCuentas.find(elemento => elemento.codigo == codig);
    return item ? item.nombre : '';
  }

  estaDeAcuerdo():boolean{
    return this.personalForm.get('deAcuerdo')?.value?true:false
  }

  transfirio():boolean{
    return this.transferenciaForm.get('transferido')?.value?true:false
  }

  esPersona():boolean{
    return this.personalForm.get('tipoDocumento')?.value != 2
  }
  pedirDatospersonales():boolean{
    const item = this.notificaciones.find(elemento => elemento.metodo == 'datosPersonales');
    return item?true:false
  }

  copiar(valor:any){
    navigator.clipboard.writeText(valor).then(() => {
      this.notif.notify('success','Copiado al portapapeles');
      console.log('Texto copiado al portapapeles!');
    }).catch(err => {
      this.notif.notify('error','No hemos podido copiar el valor');
    });
  }

}
