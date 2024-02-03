import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OperacionComponent } from './operacion.component';
import { MaterialModule } from '../material.modules';
import { ModalController } from '@ionic/angular';
import { CuentasBancariasComponentModule } from '../cuentas-bancarias/cuentas-bancarias.module';
import { CargaComprobanteComponent } from '../carga-comprobante/carga-comprobante.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    CuentasBancariasComponentModule,
    ReactiveFormsModule
  ],
  declarations: [OperacionComponent, CargaComprobanteComponent],
  exports: [OperacionComponent]
})
export class OperacionComponentModule {
  constructor(private modalCtrl: ModalController) {}

}
