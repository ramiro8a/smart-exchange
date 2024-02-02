import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OperacionComponent } from './operacion.component';
import { MaterialModule } from '../material.modules';
import { ModalController } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [OperacionComponent],
  exports: [OperacionComponent]
})
export class OperacionComponentModule {
  constructor(private modalCtrl: ModalController) {}

}
