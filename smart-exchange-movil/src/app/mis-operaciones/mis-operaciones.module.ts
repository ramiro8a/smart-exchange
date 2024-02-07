import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MisOperacionesPageRoutingModule } from './mis-operaciones-routing.module';

import { MisOperacionesPage } from './mis-operaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    MisOperacionesPageRoutingModule
  ],
  declarations: [MisOperacionesPage]
})
export class MisOperacionesPageModule {}
