import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'
import { NotifierService } from 'angular-notifier';
import { BancosService } from 'src/app/rest/bancos.service';
import { CuentasBancariasComponent } from '../cuentas-bancarias/cuentas-bancarias.component';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.sass']
})
export class OperacionComponent implements OnInit{
  estaCargando: boolean = false
  bancos: any[] = []
  cuentasRegistradas: any[] = []
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
    private restBancos: BancosService
  ){

  }

  ngOnInit(): void {
    //this.recupertaBancos();
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

  agregaCuentasBancarias(){
    const dialogRef = this.dialog.open(CuentasBancariasComponent)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.recuperaCuentasBancarias()
      }
    })
  }

  recuperaCuentasBancarias():void{
    this.restBancos.recuperaCuentasBancarias().subscribe({
      next: (response:any) => {
        this.cuentasRegistradas = response
      },
      error: (error:any) => {
      }
    });
  }

}
