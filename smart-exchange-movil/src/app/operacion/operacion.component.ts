import { Component, OnInit, Input} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import * as Const from './../utils/constants.util'
import { DatosCompartidosService, Notificacion } from '../services/datos-compartidos.service';
import { UtilsService } from '../utils/utilitarios.util';
import { BancosService } from '../services/bancos.service';
import { OperacionService } from '../services/operacion.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig} from "@angular/material/dialog";
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

      constructor(
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<CuentasBancariasComponent>,
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
      Camera.requestPermissions();
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

    async recuperaCuentasRegistradas(){
        this.estaCargando = true
        let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
        await loading.present();
        this.restBancos.recuperaCuentasRegistradas(this.cambio.origen.moneda, this.cambio.destino.moneda).subscribe({
          next: async(response:any) => {
            this.bancosOrigen = response.bancosOrigen
            this.bancosDestino = response.bancosDestino
            this.cuentasOrigen = response.cuentasOrigen
            this.cuentasDestino = response.cuentasDestino
            this.estaCargando = false
            await loading.dismiss();
          },
          error: async(error:Error) => {
            this.estaCargando = false
            this.utils.showMessage('Error', error.message);
            await loading.dismiss();
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
            error: (error:Error) => {
            this.estaCargando = false
            this.utils.showMessage('Error', error.message);
            }
        });
    }
      cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
      }
    
      confirm() {
        return this.modalCtrl.dismiss('ok', 'confirm');
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

  async agregaCuentasBancarias(){
      const modal = await this.modalCtrl.create({
        component: CuentasBancariasComponent,
        componentProps:{
        }
      });
      modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        this.recuperaCuentasRegistradas()
        console.log(`HAY QUE RECUPERAR LOS DATOS`)
      }else{
        console.log(`HA SIDO CONCELADO`)
      }
/*         const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'operacion-dialog'
        const dialogRef = this.dialog.open(CuentasBancariasComponent, dialogConfig)
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if(result){
            this.recuperaCuentasRegistradas()
            }
        })  */
    }

    async recuperaCuentaLCExchange(stepper:any){
        this.stepper = stepper
        if(!this.cuentaTransferencia){
            if(this.cuentasFormGroup.valid){
            this.estaCargando = true
            let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
            await loading.present();
            this.restBancos.recuperaDestinoTransferencia(
                this.cambio.origen.bancoId,
                this.cambio.origen.moneda
            ).subscribe({next: async(response:any) => {
                this.estaCargando = false
                await loading.dismiss();
                this.cuentaTransferencia = response
                this.stepper.next()
                },
                error: async(error:Error) => {
                this.utils.showMessage('Error', error.message);
                this.estaCargando = false
                await loading.dismiss();
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
              handler: async() => {
                let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
                await loading.present();
                this.estaCargando = true;
                let datos = {
                  monto: this.cambio.monto,
                  cuentaOrigenId: this.cuentasFormGroup.controls['cuentaOrigen'].value,
                  cuentaDestinoId: this.cuentasFormGroup.controls['cuentaDestino'].value,
                  cuentaTransferenciaId: this.cuentaTransferencia.id,
                  tipoCambioId: this.cambio.tipoCambioId
                };
                this.restOperacion.creaOperacion(datos).subscribe({
                  next: async(response: number) => {
                    await loading.dismiss();
                    this.estaCargando = false;
                    this.operacionId = response;
                    this.stepper.next();
                  },
                  error: async(error: Error) => {
                    await loading.dismiss();
                    this.utils.showMessage('Error', error.message);
                    this.estaCargando = false;
                  }
                });
              }
            }
          ]
        });
      
        await alert.present();
      }

      async abrirCamara(){
        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera
        });
        if(image.base64String){
          this.asignaComprobante(image.base64String, image.format)
          this.imagen = {
            captura: true,
            carga: false
          }
        }else{
          this.utils.showMessage('Error', 'No hemos podido recuperar los datos de la imagen');
        }
        //var imageUrl = image.webPath;
        //imageElement.src = imageUrl;
    }

    asignaComprobante(base64: string, formato: string):void{
      if(formato === "jpeg" || formato === "png"){
        let formt:string = "data:image/jpeg;base64";
        if(formato === "png"){
          formt = "data:image/png;base64"
        }
        this.finalizaForm.controls['comprobante'].setValue(formt+','+base64);
      }else{
        this.utils.showMessage('Error', 'formatos permitidos solo jpg y png');
      }
      
    }
  
    async cargaFoto(){
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });
      console.error(image)
      if(image.base64String){
        console.warn(image)
        this.asignaComprobante(image.base64String, image.format)
        this.imagen = {
          captura: false,
          carga: true
        }
      }else{
        this.utils.showMessage('Error', 'No hemos podido recuperar los datos de la imagen');
      }
      //var imageUrl = image.webPath;
      //imageElement.src = imageUrl;
    }


    async guardarFinalizar(){
      if(this.finalizaForm.valid){
        let datos ={
          codigoTransferencia: this.finalizaForm.controls['codigoTransferencia'].value,
          comprobante: this.finalizaForm.controls['comprobante'].value,
        }
        this.estaCargando = true
        let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
        await loading.present();
        this.restOperacion.actualizaOperacion(this.operacionId, 2 ,datos).subscribe({
          next: async(response:any) => {
            this.estaCargando = false
            console.log(response)
            this.utils.showMessage('Genial', `Se registró con éxito la operación, lo procesaremos lo más antes posible ticket: ${this.operacionId.toString().padStart(8, '0')}`);
            await loading.dismiss();
            this.confirm()
          },
          error: async(error:Error) => {
            this.utils.showMessage('Error', error.message);
            this.estaCargando = false
            await loading.dismiss();
          }
        });
      }else{
        this.utils.showMessage('Atención!', 'Complete el formulario por favor');
      }
    }
      
}
