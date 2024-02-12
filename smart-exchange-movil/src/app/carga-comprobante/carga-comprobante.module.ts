import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../material.modules';
import { CargaComprobanteComponent } from './carga-comprobante.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,MaterialModule],
  declarations: [CargaComprobanteComponent],
  exports: [CargaComprobanteComponent]
})
export class CargaComprobanteComponentModule {}