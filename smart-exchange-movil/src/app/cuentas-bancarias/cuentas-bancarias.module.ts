import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../material.modules';
import { CuentasBancariasComponent } from './cuentas-bancarias.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,
    ReactiveFormsModule,
    MaterialModule],
  declarations: [CuentasBancariasComponent],
  exports: [CuentasBancariasComponent]
})
export class CuentasBancariasComponentModule {}
