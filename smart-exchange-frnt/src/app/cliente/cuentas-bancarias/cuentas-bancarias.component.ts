import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators } from '@angular/forms'
import * as Const from 'src/app/utils/constants.service'
import { NotifierService } from 'angular-notifier';
import { BancosService, CuentaBancariaResponse } from 'src/app/rest/bancos.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-cuentas-bancarias',
  templateUrl: './cuentas-bancarias.component.html',
  styleUrls: ['./cuentas-bancarias.component.sass']
})
export class CuentasBancariasComponent implements OnInit{
  estaCargando: boolean = false
  cuentaBancariaForm: FormGroup;
  bancos: any[] = []
  tipoCuentas: any[] = Const.TIPO_CUENTAS
  monedas: any[] = Const.CUENTA_MONEDAS_CLIENTE
  cuentaBancaria!: CuentaBancariaResponse

  constructor(
    private dialogRef: MatDialogRef<CuentasBancariasComponent>,
    private formBuilder: FormBuilder,
    private notif: NotifierService,
    private restBancos: BancosService,
    private tokenService: TokenService,
    @Inject(MAT_DIALOG_DATA) data:CuentaBancariaResponse
  ){
    if(data){
      this.cuentaBancaria = data
    }
    this.cuentaBancariaForm = this.formBuilder.group({
      tipoCuenta: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      banco: ['', [Validators.required]],
      numeroCuenta: ['', Validators.required],
      nombre: ['', Validators.required],
      //ruc: [''],
      deAcuerdo: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.recupertaBancos();
    if(this.cuentaBancaria){
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
    }
    if(this.esCliente()){
      //this.cuentaBancariaForm.controls['deAcuerdo'].setValue(false);
    }
    if(this.esOperador()){
/*       this.cuentaBancariaForm.controls['ruc'].setValidators([Validators.required]);
      this.cuentaBancariaForm.controls['ruc'].updateValueAndValidity(); */
    }
  }

  esCliente():boolean{
    return this.tokenService.esCliente();
  }

  esOperador():boolean{
    return this.tokenService.esOperador();
  }

  recupertaBancos():void{
    this.restBancos.recuperaBancosActivos().subscribe({
      next: (response:any) => {
        this.bancos = response
      },
      error: (error:any) => {
        this.notif.notify('error', error);
      }
    });
  }

  registra():void{
    if(this.cuentaBancariaForm.valid){
      this.estaCargando = true;
      if(this.cuentaBancaria){
        this.restBancos.editaCuentaBancaria(this.cuentaBancaria.id,this.cuentaBancariaForm.value).subscribe({
          next: (response:any) => {
            this.estaCargando = false;
            this.notif.notify('success', 'Datos registrados exitosamente');
            this.close(true);
          },
          error: (error:any) => {
            this.estaCargando = false;
            this.notif.notify('error', error);
          }
        });
      }else{
        this.restBancos.creaCuentaBancaria(this.cuentaBancariaForm.value).subscribe({
          next: (response:any) => {
            this.estaCargando = false;
            this.notif.notify('success', 'Datos registrados exitosamente');
            this.close(true);
          },
          error: (error:any) => {
            this.estaCargando = false;
            this.notif.notify('error', error);
          }
        });
      }
    }else{
      this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  close(data:boolean){
    this.dialogRef.close(data);
  }

  estaDeAcuerdo():boolean{
    return this.cuentaBancariaForm.get('deAcuerdo')?.value
  }

}
