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
  tipos:any[]=Const.TIPO_CAMBIOS
  tcForm: FormGroup;
  estaCargando: boolean = false
  dataSource: TipoCambioResponse[] = [];
  displayedColumns: string[] = ['tipo','fecha', 'estado','moneda', 'compra', 'venta'];
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
        moneda: ['', [Validators.required]],
        compra: ['', [Validators.required, ImporteValidator()]],
        venta: ['', [Validators.required, ImporteValidator()]],
        porDefecto: [true, Validators.required]
      }); 
    }
    
  ngOnInit(): void {
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

  activar(item:TipoCambioResponse):void{

  }
  cambioPassword(item:TipoCambioResponse):void{

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
}
