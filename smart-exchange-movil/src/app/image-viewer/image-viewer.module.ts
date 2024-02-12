import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../material.modules';
import { ImageViewerComponent } from './image-viewer.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,MaterialModule],
  declarations: [ImageViewerComponent],
  exports: [ImageViewerComponent]
})
export class ImageViewerComponentModule {}
