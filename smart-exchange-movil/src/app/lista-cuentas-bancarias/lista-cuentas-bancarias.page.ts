import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from './../utils/constants.util'
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { BancosService, CuentaBancariaResponse } from '../services/bancos.service';
import { UtilsService } from '../utils/utilitarios.util';
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';

@Component({
  selector: 'app-lista-cuentas-bancarias',
  templateUrl: './lista-cuentas-bancarias.page.html',
  styleUrls: ['./lista-cuentas-bancarias.page.scss'],
})
export class ListaCuentasBancariasPage implements OnInit, ViewWillEnter {
  @ViewChild('scrolInfinito') scrolInfinito!: ElementRef;
  //criterioForm: FormGroup;
  monedas: any[]=Const.CUENTA_MONEDAS_CLIENTE
  estaCargando = true
  estaScroll:boolean = false
  dataSource: CuentaBancariaResponse[] = []
  bancos: any[] = [];
  loaderCustom=[1,2,3,4,5,6,7,8,9,10]

  constructor(
    private utils: UtilsService,
    private loadingController: LoadingController,
    private restBancos: BancosService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.dataSource = []
    this.recuperaCuentasBancarias();
  }

  recuperaCuentasBancarias():void{
    this.estaCargando = true
    this.restBancos.recuperaCuentasBancarias().subscribe({
      next: (response:CuentaBancariaResponse[]) => {
        response.forEach(element => {
          element.activo = element.estado==0
        });
        this.dataSource = response;
        this.estaCargando = false
      },
      error: (error:Error) => {
        this.estaCargando = false
        this.utils.showMessage('Error',error.message)
      }
    });
  }

  async cambioEstado(cuenta: CuentaBancariaResponse) {
    console.log('cambiando')
    let activo = cuenta.activo?true:false
    let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
    await loading.present();
    this.restBancos.habilitaDeshabilitaCuenta(cuenta.id, !activo).subscribe({
      next: async(response:any) => {
        cuenta.activo = !activo
        await loading.dismiss();
      },
      error: async(error:Error) => {
        this.utils.showMessage('Error',error.message)
        await loading.dismiss();
      }
    });
  }

  buscarNombreDeTipoCuenta(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.TIPO_CUENTAS);
  }

  recuperaNombre(codig:number):string{
    const item = this.monedas.find(elemento => elemento.codigo == codig);
    return item ? item.nombre : '';
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
      this.recuperaCuentasBancarias();
    }else{
      console.log(`HA SIDO CONCELADO`)
    }
  }

  async editar(cuenta: CuentaBancariaResponse){
    const modal = await this.modalCtrl.create({
      component: CuentasBancariasComponent,
      componentProps:{
        cuentaBancaria: cuenta,
        esNuevo: false
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.recuperaCuentasBancarias();
    }else{
      console.log(`HA SIDO CONCELADO`)
    }
  }

  onScroll(event: any) {
/*     const offset = event.target.scrollTop;
    const height = this.scrolInfinito.nativeElement.scrollHeight;
    const visibleHeight = this.scrolInfinito.nativeElement.offsetHeight;
    if (offset + visibleHeight +15>= height) {
      if(!this.estaScroll){
          console.log(offset + visibleHeight)
          console.log(height)
          if(!this.paginaActual.last){
            console.log('RECUPERANDO: pagina'+(this.paginaActual.number+1)+' y filas: '+(this.paginaActual.numberOfElements));
            console.warn(this.paginaActual);
            this.recuperaOperacionesPaginado(this.paginaActual.number+1, this.paginaActual.numberOfElements)
          }
      }
    } */
  }

}
