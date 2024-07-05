import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TipoCambioService, TipoCambioResponse } from 'src/app/rest/tipo-cambio.service';
import * as Const from 'src/app/utils/constants.service'
import { FormBuilder ,FormGroup, Validators,FormArray  } from '@angular/forms'
import { ImporteValidator } from 'src/app/utils/validators.validator';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.sass']
})
export class TipoCambioComponent implements OnInit{
  esLcExchange:boolean = false
  tipos:any[]=Const.TIPO_CAMBIOS
  tcForm: FormGroup;
  estaCargando: boolean = false
  dataSource: TipoCambioResponse[] = [];
  displayedColumns: string[] = ['logo','tipo','registro','fecha', 'estado', 'compra', 'venta'];
  monedas: any[]=Const.MONEDAS
  constructor(
    private dialog: MatDialog,
    private restTC: TipoCambioService,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    ){
      this.tcForm = this.formBuilder.group({
        tipo: ['', Validators.required],
        fecha: ['', Validators.required],
        moneda: [Const.USD_ISO, [Validators.required]],
        compra: ['', [Validators.required, ImporteValidator()]],
        venta: ['', [Validators.required, ImporteValidator()]],
        porDefecto: [true, Validators.required],
        logo: ['', Validators.required],
        nombre: ['', Validators.required]
      }); 
    }
    
  ngOnInit(): void {
    this.tcForm.get('tipo')?.valueChanges.subscribe((valor) => {
      this.esLcExchange = valor==1
      if(this.esLcExchange){
        this.tcForm.controls['logo'].setValue(Const.LC_EXCHANGE_LOGO);
        this.tcForm.controls['nombre'].setValue('LC');
      }else{
        this.tcForm.controls['logo'].setValue('');
        this.tcForm.controls['nombre'].setValue('');
      }
    });
    this.recuperaTC();
  }

  
  recuperaTC():void{
    this.restTC.recuperaTiposDeCambioCincoDias(Const.USD_ISO).subscribe({
      next: (response:any) => {
        this.dataSource = response as TipoCambioResponse[]
      },
      error: (error:any) => {
      }
    });
  }

  recuperaTipo(codig:number):string{
    const item = this.tipos.find(elemento => elemento.codigo == codig);
    return item ? item.nombre : '';
  }

  recuperaNombre(codig:number):string{
    const item = this.monedas.find(elemento => elemento.codigo == codig);
    return item ? item.nombre : '';
  }

  registra():void{
    if(this.tcForm.valid){
      this.estaCargando = true;
      this.restTC.creaTipoCambio(this.tcForm.value).subscribe({
        next: (response:any) => {
          this.estaCargando = false;
          this.notif.notify('success', 'Tipo de cambio registrado');
          this.recuperaTC();
        },
        error: (error:any) => {
          this.estaCargando = false;
          this.notif.notify('error', error);
        }
      });
    }else{
      this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  cargoimagen():boolean{
    const logoField = this.tcForm.get('logo');
    return logoField!.valid;
  }

  cambioEstado(tipoDeCambio: TipoCambioResponse):void{
    console.log(tipoDeCambio)
  }

  archivoSeleccionado(event: any):void{
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          this.tcForm.controls['logo'].setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
