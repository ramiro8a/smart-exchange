import { Component, OnInit, Input} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import * as Const from './../utils/constants.util'
import { DatosCompartidosService, Notificacion } from '../services/datos-compartidos.service';
import { UtilsService } from '../utils/utilitarios.util';
import { BancosService } from '../services/bancos.service';
import { OperacionService } from '../services/operacion.service';

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
  styleUrls: ['./operacion.component.scss'],
})
export class OperacionComponent implements OnInit{
    @Input() data: any;
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
    @Input() cambio!: Cambio;

    ///BORRAR
    firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required],
      });
      secondFormGroup = this.formBuilder.group({
        secondCtrl: ['', Validators.required],
      });
      isLinear = false;
    ///BORRAR
      constructor(
        private alertController: AlertController,
        private loadingController: LoadingController,
        private formBuilder: FormBuilder,
        private utils: UtilsService,
        private modalCtrl: ModalController,
        private restBancos: BancosService,
        private datosCompartidos: DatosCompartidosService,
        private restUtils: UtilsService,
        private restOperacion: OperacionService
        ) {
            
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
      cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
      }
    
      confirm() {
        return this.modalCtrl.dismiss('RAMIRO', 'confirm');
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
            this.utils.showMessage('Genial!','Copiado al portapapeles');
          console.log('Texto copiado al portapapeles!');
        }).catch(err => {
            this.utils.showMessage('Error','No hemos podido copiar el valor');
        });
      }

    agregaCuentasBancarias(){
/*         const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'operacion-dialog'
        const dialogRef = this.dialog.open(CuentasBancariasComponent, dialogConfig)
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if(result){
            this.recuperaCuentasRegistradas()
            }
        }) */
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
                this.utils.showMessage('Error', error);
                this.estaCargando = false
                }
            });
            }else{
                this.utils.showMessage('Atención!','Complete el formulario con datos válidos por favor');
            }
        }else{
            this.stepper.next()
        }
    }

    async guardaTransferencia(stepper: any): Promise<void> {
        this.stepper = stepper;
        const alert = await this.alertController.create({
          header: '¿Confirma que realizó la transferencia?',
          message: 'Si confirma, se generará una operación para que nuestros operadores la procesen.',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Operación cancelada');
              }
            },
            {
              text: 'Confirmar',
              handler: () => {
                this.estaCargando = true;
                let datos = {
                  monto: this.cambio.monto,
                  cuentaOrigenId: this.cuentasFormGroup.controls['cuentaOrigen'].value,
                  cuentaDestinoId: this.cuentasFormGroup.controls['cuentaDestino'].value,
                  cuentaTransferenciaId: this.cuentaTransferencia.id,
                  tipoCambioId: this.cambio.tipoCambioId
                };
                this.restOperacion.creaOperacion(datos).subscribe({
                  next: (response: number) => {
                    this.estaCargando = false;
                    this.operacionId = response;
                    this.stepper.next();
                  },
                  error: (error: any) => {
                    this.utils.showMessage('Error', error);
                    this.estaCargando = false;
                  }
                });
              }
            }
          ]
        });
      
        await alert.present();
      }
      
}
