import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MisOperacionesPageRoutingModule } from './mis-operaciones-routing.module';
import { MaterialModule } from '../material.modules';
import { MisOperacionesPage } from './mis-operaciones.page';
import { OperacionCuentasComponentModule } from '../operacion-cuentas/operacion-cuentas.module';
import { ImageViewerComponentModule } from '../image-viewer/image-viewer.module';
import { CargaComprobanteComponent } from '../carga-comprobante/carga-comprobante.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    MaterialModule,
    ReactiveFormsModule,
    MisOperacionesPageRoutingModule,
    OperacionCuentasComponentModule,
    ImageViewerComponentModule
  ],
  declarations: [MisOperacionesPage, CargaComprobanteComponent]
})
export class MisOperacionesPageModule {}
