import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RegistratePageRoutingModule } from './registrate-routing.module';
import { RegistratePage } from './registrate.page';
import { MaterialModule } from '../material.modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaterialModule,
    RegistratePageRoutingModule
  ],
  declarations: [RegistratePage]
})
export class RegistratePageModule {}
