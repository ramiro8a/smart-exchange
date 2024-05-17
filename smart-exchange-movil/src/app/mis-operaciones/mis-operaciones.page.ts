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
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { CargaComprobanteComponent } from '../carga-comprobante/carga-comprobante.component';
import { StatusBar, Style } from '@capacitor/status-bar';

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
  filasInicial: number=8
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
    StatusBar.setBackgroundColor({color: '#2d47af'})
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

  async recuperarComprobante(operacionId:number, tipo:number) {
    let loading = await this.loadingController.create({spinner: 'bubbles', message: 'Espere por favor'});
    await loading.present();
    this.restOperacion.recuperaComprobante(operacionId, tipo).subscribe({
      next: async(response:any) => {
        const partes: string[] = response.base64.split(",");
        try {
          loading.message = 'Guardando archivo..'
          await Filesystem.writeFile({
            path: response.nombreArchivo,
            data: response.base64,
            directory: Directory.Documents
          });
          this.utils.showMessage('Genial!','Se descargó en Documentos el archivo '+response.nombreArchivo)
          await loading.dismiss();
        } catch (e) {
          await loading.dismiss();
          this.utils.showMessage('Error','Error al guardar achivo, verifique permisos')
        }
      }, error: async(error:Error) => {
        await loading.dismiss();
        this.utils.showMessage('Error',error.message)
      }
    });
  }

  async cargarComprobante(id:number){
    const modal = await this.modalCtrl.create({
      component: CargaComprobanteComponent,
      componentProps:{
        operacionId: id
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
    }
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
    if(this.paginaInicial==pagina){
      this.estaCargando = true
    }else{
      this.estaCargando2 = true
    }
    const valoresFormulario = this.criterioForm.value;
    let datos = {
      inicio: new Date('2000-01-01').toISOString().split('T')[0],
      fin: new Date('3000-12-31').toISOString().split('T')[0],
      ticket: valoresFormulario.ticket
    };
    this.restOperacion.recuperaOperacionesPaginado(pagina, filas, datos).subscribe({
      next: async(response:PaginaOperacionResponse) => {
        this.dataSource = [...this.dataSource, ...response.content];
        this.paginaActual = response
        this.estaScroll = false
        this.estaCargando2 = false
        this.estaCargando = false
      },
      error: async (error:Error) => {
        this.estaScroll = false
        this.estaCargando2 = false
        this.estaCargando = false
        this.utils.showMessage('Error',error.message)
      }
    });
  }

  async recuperaInicial(){
    //this.resetForm()
    //this.estaCargando = true
    await this.recuperaOperacionesPaginado(this.paginaInicial, this.filasInicial)
    //setTimeout(()=>{
      //this.estaCargando = false
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
