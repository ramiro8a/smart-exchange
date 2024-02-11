import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ListaCuentasBancariasPageRoutingModule } from './lista-cuentas-bancarias-routing.module';
import { MaterialModule } from '../material.modules';
import { ListaCuentasBancariasPage } from './lista-cuentas-bancarias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ExploreContainerComponentModule,
    ListaCuentasBancariasPageRoutingModule
  ],
  declarations: [ListaCuentasBancariasPage]
})
export class ListaCuentasBancariasPageModule {}
