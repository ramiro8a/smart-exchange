import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from './../utils/constants.util'
import { ClienteResponse, UsuariosService } from '../services/usuarios.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';
import { DatosCompartidosService, Notificacion } from '../services/datos-compartidos.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent  implements OnInit {
  estaCargando: boolean = false
  esNuevo:boolean = true
  personalForm: FormGroup;
  tipoDocumentos: any[] = Const.TIPO_DOCUMENTOS
  clienteValidado:boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private utils: UtilsService,
    private restUsuario: UsuariosService,
    private datosCompartidos: DatosCompartidosService,
    private restUtils: UtilsService,
  ) { 
    this.personalForm = this.formBuilder.group({
      tipoDocumento: [1, [Validators.required]],
      nroDocumento: ['', [Validators.required]],
      nombres: ['', Validators.required],
      /* sNombre: [''], */
      paterno: ['', Validators.required],
      materno: [''],
      celular: [''],
      deAcuerdo: [false, [Validators.required]]
    });
  }

  ngOnInit() {
    this.recuperaDatosCliente()
    this.personalForm.get('tipoDocumento')?.valueChanges.subscribe((tipoDocumento) => {
      if(tipoDocumento===2){
        this.personalForm.controls['paterno'].setValidators([]);
      }else{
        this.personalForm.controls['paterno'].setValidators([Validators.required]);
      }
      this.personalForm.controls['paterno'].updateValueAndValidity();
    });
  }

  async registra(){
    if(this.personalForm.valid){
      let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
      await loading.present();
      this.restUsuario.registraDatosPersonalesCliente(this.personalForm.value).subscribe({
        next: async(response:any) => {
          this.utils.showMessage('Genial!', 'Datos registrados exitosamente');
          await loading.dismiss();
          this.recuperaNotificaciones()
          this.confirm();
        },
        error: async(error:Error) => {
          await loading.dismiss();
          if (error.message.toLowerCase().includes('revise sus datos en USUARIO'.toLowerCase())) {
            this.utils.showMessage('Alerta', error.message);
            this.cancel();
          } else {
            this.utils.showMessage('Error', error.message);
          }
        }
      });
    }else{
      //this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  async recuperaNotificaciones(){
    this.restUtils.recuperaNotificaciones().subscribe({
      next: async (response:any) => {
        this.datosCompartidos.actualizarNotificaciones(response as Notificacion[]);
      },
      error: (error:any) => {
      }
    });
  }

  esPersona():boolean{
    return this.personalForm.get('tipoDocumento')?.value != 2
  }

  estaDeAcuerdo():boolean{
    return this.personalForm.get('deAcuerdo')?.value
  }

  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  imprimeBtn():string{
    if(this.esNuevo){
      return 'Registrar'
    }else if(!this.clienteValidado && !this.esNuevo){
      return 'Actualizar'
    }else{
      return 'Actualizar celular'
    }
  }

  async recuperaDatosCliente(){
    this.estaCargando = true
    let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
    await loading.present();
    this.restUsuario.recuperaCliente().subscribe({
      next: async(response:ClienteResponse) => {
        response.tipoDocumento
        this.personalForm.setValue({
          tipoDocumento: response.tipoDocumento,
          nroDocumento: response.nroDocumento,
          nombres: response.nombres,
          paterno: response.paterno,
          materno: response.materno,
          celular: response.celular,
          deAcuerdo: true,
        })
        this.clienteValidado = response.validado
        this.estaCargando = false;
        this.esNuevo = false
        if(this.clienteValidado){
          this.personalForm.disable();
          this.personalForm.get('celular')?.enable()
        }
        await loading.dismiss();
      },
      error: async (error:Error) => {
        await loading.dismiss();
        this.estaCargando = false;
      }
    });
  }

}
