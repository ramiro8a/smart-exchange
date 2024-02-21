import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ConfiguracionesComponent } from '../configuraciones/configuraciones.component';
import { ExploreContainerComponent } from './explore-container.component';
import { NotificacionesComponent } from '../notificaciones/notificaciones.component';
import { MaterialModule } from '../material.modules';

@NgModule({
  imports: [ CommonModule,
    FormsModule, 
    IonicModule,
    MaterialModule],
  declarations: [ExploreContainerComponent, ConfiguracionesComponent, NotificacionesComponent],
  exports: [ExploreContainerComponent]
})
export class ExploreContainerComponentModule {
}
