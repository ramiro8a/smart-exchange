import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.modules';
import { IonicModule } from '@ionic/angular';
import { ClientePageRoutingModule } from './cliente-routing.module';
import { ClientePage } from './cliente.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { OperacionComponentModule } from '../operacion/operacion.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    OperacionComponentModule,
    ReactiveFormsModule,
    MaterialModule,
    ClientePageRoutingModule
  ],
  declarations: [ClientePage],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ]
})
export class ClientePageModule {}
