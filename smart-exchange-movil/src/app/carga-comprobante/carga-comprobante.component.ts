import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UtilsService } from '../utils/utilitarios.util';
import { OperacionService } from '../services/operacion.service';

@Component({
  selector: 'app-carga-comprobante',
  templateUrl: './carga-comprobante.component.html',
  styleUrls: ['./carga-comprobante.component.scss'],
})
export class CargaComprobanteComponent  implements OnInit {
  @Input() operacionId!:number
  estaCargando: boolean = false
  finalizaForm = this.formBuilder.group({
    codigoTransferencia: ['', [Validators.required]],
    comprobante: ['', [Validators.required]],
    noTiene: [false]
  });
  imagen={
    captura: false,
    carga:false
  }

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private restOperacion: OperacionService
  ) { 
  }

  ngOnInit() {}

  async abrirCamara(){
    const image = await Camera.getPhoto({
      quality: 90,
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
}

async cargaFoto(){
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Photos
  });
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

  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
