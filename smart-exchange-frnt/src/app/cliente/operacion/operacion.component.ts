import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'
import { NotifierService } from 'angular-notifier';
import { BancosService } from 'src/app/rest/bancos.service';
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';

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
  styleUrls: ['./operacion.component.sass']
})
export class OperacionComponent implements OnInit{
  cambio:Cambio
  estaCargando: boolean = false
  bancos: any[] = []
  cuentas: any[] = []
  cuentasDestino: any[] = []
  cuentasOrigen: any[] = []
  tipoCuentas: any[] = Const.TIPO_CUENTAS
  monedas: any[] = Const.CUENTA_MONEDAS_CLIENTE
  cuentasFormGroup = this.formBuilder.group({
    bancoOrigen: ['', [Validators.required]],
    cuentaOrigen: ['', [Validators.required]],
    bancoDestino: ['', [Validators.required]],
    cuentaDestino: ['', [Validators.required]],
  });
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = true;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CuentasBancariasComponent>,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    private restBancos: BancosService,
    @Inject(MAT_DIALOG_DATA) data:Cambio
  ){
    this.cambio = data
    console.warn(this.cambio)
  }

  ngOnInit(): void {
    this.recuperaCuentasRegistradas();
    this.cuentasFormGroup.controls.bancoOrigen.valueChanges.subscribe(data=>{
      this.cuentasOrigen = []
      this.cuentas.forEach(element => {
        if (element.banco===data) {
          this.cuentasOrigen.push(element)
        }
      })
    })
    this.cuentasFormGroup.controls.bancoDestino.valueChanges.subscribe(data=>{
      this.cuentasDestino = []
      this.cuentas.forEach(element => {
        if (element.banco===data) {
          this.cuentasDestino.push(element)
        }
      })
    })
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

  agregaCuentasBancarias(){
    const dialogRef = this.dialog.open(CuentasBancariasComponent)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaCuentasRegistradas()
      }
    })
  }

  recuperaCuentasRegistradas():void{
    this.restBancos.recuperaCuentasRegistradas().subscribe({
      next: (response:any) => {
        this.cuentas = response.cuentas
        this.bancos = response.bancos
      },
      error: (error:any) => {
      }
    });
  }

}
