import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../material.modules';
import { OperacionCuentasComponent } from './operacion-cuentas.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,MaterialModule],
  declarations: [OperacionCuentasComponent],
  exports: [OperacionCuentasComponent]
})
export class OperacionCuentasComponentModule {}
