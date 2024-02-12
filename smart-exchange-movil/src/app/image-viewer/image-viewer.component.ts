import { Component, OnInit } from '@angular/core';
import { ModalController, ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent  implements OnInit, ViewWillEnter {
  imagenBase64!: string;
  anguloRotacion: number = 0;
  escalaZoom: number = 1;
  transform: string = '';


  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    console.log(this.imagenBase64)
  }
  ionViewWillEnter() {
    console.warn(this.imagenBase64)
  }

  girarImagen() {
    this.anguloRotacion = (this.anguloRotacion + 90) % 360;
    this.actualizarTransform();
  }

  hacerZoom(aumentar: boolean) {
    if (aumentar) {
      this.escalaZoom += 0.1;
    } else {
      this.escalaZoom = Math.max(1, this.escalaZoom - 0.1);
    }
    this.actualizarTransform();
  }

  actualizarTransform() {
    this.transform = `rotate(${this.anguloRotacion}deg) scale(${this.escalaZoom})`;
  }

  confirm(){
    return this.modalCtrl.dismiss(true, 'confirm');
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
