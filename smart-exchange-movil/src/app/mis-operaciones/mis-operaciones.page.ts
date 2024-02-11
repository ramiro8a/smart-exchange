import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import { OperacionResponse, OperacionService, PaginaOperacionResponse } from '../services/operacion.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import * as Const from './../utils/constants.util'
import { UtilsService } from '../utils/utilitarios.util';
import { SocketService } from '../services/socket.service';
import { TokenService } from '../services/token.service';
import { OperacionCuentasComponent } from '../operacion-cuentas/operacion-cuentas.component';

@Component({
  selector: 'app-mis-operaciones',
  templateUrl: './mis-operaciones.page.html',
  styleUrls: ['./mis-operaciones.page.scss'],
})
export class MisOperacionesPage implements OnInit, ViewWillEnter {
  @ViewChild('scrolInfinito') scrolInfinito!: ElementRef;
  loaderCustom=[1,2,3,4,5,6,7,8,9,10]
  criterioForm: FormGroup;
  estaCargando = false
  estaCargando2 = false
  dataSource: OperacionResponse[] = [];
  filasInicial: number=7
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
  estaScroll:boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private restOperacion: OperacionService,
    private loadingController: LoadingController,
    private socketService: SocketService,
    private tokenServ: TokenService,
    private utils: UtilsService,
    private modalCtrl: ModalController
  ) { 
    this.criterioForm = this.formBuilder.group({
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      ticket: [''],
    });
  }

  ngOnInit() {
    this.tokenServ.recuperaUsuarioId().then(userId => {
      this.socketService.joinRoomCambioEstado(userId);
    });
  }

  ionViewWillEnter() {
    this.dataSource = []
    this.recuperaInicial();
  }

  recuperarComprobante(operacionId:number, tipo:number):void{
/*     this.estaCargando = true
    this.restOperacion.recuperaComprobante(operacionId, tipo).subscribe({
      next: (response:any) => {
        this.estaCargando = false
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          base64:response
        } 
        const dialogRef = this.dialog.open(ImagenComponent, dialogConfig)
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            ///this.recuperaCuentasBancarias()
          }
        })
      },
      error: (error:any) => {
        this.notif.notify('error',error);
        this.estaCargando = false
      }
    }); */
  }

  cargarComprobante(id:number){
/*     const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      operacionId : id
    } 
    const dialogRef = this.dialog.open(CargaComprobanteComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaOperacionesPaginado(this.paginaActual.number, this.paginaActual.size);
      }
    }) */
  }

  async verCuentas(operacion: OperacionResponse){
    const modal = await this.modalCtrl.create({
      component: OperacionCuentasComponent,
      componentProps:{
        operacion: operacion
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      //this.recuperaCuentasBancarias();
    }
  }

  async recuperaOperacionesPaginado(pagina:number, filas:number ){
    this.estaScroll = true
    this.estaCargando2 = true
    const valoresFormulario = this.criterioForm.value;
/*     let datos={
      inicio: new Date(valoresFormulario.inicio).toISOString().split('T')[0],
      fin: new Date(valoresFormulario.fin).toISOString().split('T')[0],
      ticket: valoresFormulario.ticket
    } */
    let datos = {
      inicio: new Date('2000-01-01').toISOString().split('T')[0],
      fin: new Date('3000-12-31').toISOString().split('T')[0],
      ticket: valoresFormulario.ticket
    };
//    let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
//    await loading.present();
    this.restOperacion.recuperaOperacionesPaginado(pagina, filas, datos).subscribe({
      next: async(response:PaginaOperacionResponse) => {
        //this.dataSource = response.content
        this.dataSource = [...this.dataSource, ...response.content];
        this.paginaActual = response
        this.estaScroll = false
        this.estaCargando2 = false
//        await loading.dismiss();
      },
      error: async (error:Error) => {
        this.estaScroll = false
        this.estaCargando2 = false
        this.utils.showMessage('Error',error.message)
//        await loading.dismiss();
      }
    });
  }

  async recuperaInicial(){
    //this.resetForm()
    this.estaCargando = true
    await this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
    //setTimeout(()=>{
      this.estaCargando = false
    //}, 2000)
  }




  onScroll(event: any) {
    const offset = event.target.scrollTop;
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
    }
  }

  buscarNombreDeEstado(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.ESTADOS_OPERACION);
  }
  
  buscarNombreDeTransferencia(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.TIPO_TRANSFERENCIAS);
  }
  buscarNombreDeMoneda(codigo:number):string{
    return Const.buscarNombrePorCodigo(codigo, Const.CUENTA_MONEDAS_CLIENTE);
  }

  buscarClasePorCodigo(codigo:number):string{
    return Const.buscarClassPorCodigo(codigo, Const.ESTADOS_OPERACION);
  }
  buscarAbrevDeMoneda(codigo:number):string{
    return Const.buscarAbrevPorCodigo(codigo, Const.CUENTA_MONEDAS_CLIENTE);
  }

  
}
