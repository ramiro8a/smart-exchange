import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from './../utils/constants.util'
import { UtilsService } from '../utils/utilitarios.util';
import { BancosService } from '../services/bancos.service';
import { CuentaBancariaResponse } from '../services/bancos.service';
import { TokenService } from '../services/token.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cuentas-bancarias',
  templateUrl: './cuentas-bancarias.component.html',
  styleUrls: ['./cuentas-bancarias.component.scss']
})
export class CuentasBancariasComponent implements OnInit{
  esNuevo: boolean = true
  cuentaBancariaForm: FormGroup;
  bancos: any[] = []
  tipoCuentas: any[] = Const.TIPO_CUENTAS
  monedas: any[] = Const.CUENTA_MONEDAS_CLIENTE
  cuentaBancaria!: CuentaBancariaResponse

  constructor(
    private formBuilder: FormBuilder,
    private restBancos: BancosService,
    private tokenService: TokenService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private utils: UtilsService,
    private loadingController: LoadingController,
  ){
/*     if(data){
      this.cuentaBancaria = data
      this.esNuevo = false
      console.warn('es edicion')
    }else{
      console.warn('es NUEVO')
    } */
    this.cuentaBancariaForm = this.formBuilder.group({
      tipoCuenta: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      banco: ['', [Validators.required]],
      numeroCuenta: ['', Validators.required],
      nombre: ['', Validators.required],
      deAcuerdo: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.recupertaBancos();
    
/*  
if(!this.esNuevo){
     this.cuentaBancariaForm.setValue({
        tipoCuenta: this.cuentaBancaria.tipoCuenta,
        moneda: this.cuentaBancaria.moneda,
        banco: this.cuentaBancaria.banco,
        numeroCuenta: this.cuentaBancaria.numeroCuenta,
        nombre: this.cuentaBancaria.nombre,
        deAcuerdo: true
      })
      this.cuentaBancariaForm.controls['moneda'].disable()
      this.cuentaBancariaForm.controls['banco'].disable()
    } */
  }


  recupertaBancos():void{
    this.restBancos.recuperaBancosActivos().subscribe({
      next: (response:any) => {
        this.bancos = response
      },
      error: (error:any) => {
        this.utils.showMessage('Error', error);
      }
    });
  }

  async registra(){
    if(this.cuentaBancariaForm.valid){
      let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
      await loading.present();
      if(this.cuentaBancaria){
        this.restBancos.editaCuentaBancaria(this.cuentaBancaria.id,this.cuentaBancariaForm.value).subscribe({
          next: async(response:any) => {
            this.utils.showMessage('Genial!', 'Datos registrados exitosamente');
            await loading.dismiss();
            this.confirm();
          },
          error: async(error:any) => {
            this.utils.showMessage('Error',error);
            await loading.dismiss();
          }
        });
      }else{
        this.restBancos.creaCuentaBancaria(this.cuentaBancariaForm.value).subscribe({
          next: async(response:any) => {
            this.utils.showMessage('Genial!', 'Datos registrados exitosamente');
            await loading.dismiss();
            this.confirm();
          },
          error: async(error:any) => {
            this.utils.showMessage('Error',error);
            await loading.dismiss();
          }
        });
      }
    }else{
      this.utils.showMessage('Atención!','Complete el formulario por favor');
    }
  }

  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  estaDeAcuerdo():boolean{
    return this.cuentaBancariaForm.get('deAcuerdo')?.value
  }

}
