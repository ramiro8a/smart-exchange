import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from './../utils/constants.util'
import { UsuariosService } from '../services/usuarios.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { UtilsService } from '../utils/utilitarios.util';

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

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private utils: UtilsService,
    private restUsuario: UsuariosService
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

  ngOnInit() {}

  async registra(){
    if(this.personalForm.valid){
      this.estaCargando = true;
      let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
      await loading.present();
      this.restUsuario.registraDatosPersonalesCliente(this.personalForm.value).subscribe({
        next: async(response:any) => {
          this.estaCargando = false;
          this.utils.showMessage('Genial!', 'Datos registradosexitosamente');
          await loading.dismiss();
          this.confirm();
        },
        error: async(error:Error) => {
          this.estaCargando = false;
          this.utils.showMessage('Error', error.message);
          await loading.dismiss();
        }
      });
    }else{
      //this.notif.notify('warning','Complete el formulario por favor');
    }
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

}
