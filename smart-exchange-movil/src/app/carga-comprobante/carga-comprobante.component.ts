import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-carga-comprobante',
  templateUrl: './carga-comprobante.component.html',
  styleUrls: ['./carga-comprobante.component.scss'],
})
export class CargaComprobanteComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    Camera.requestPermissions();
  }

  async tomarFoto(){
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      var imageUrl = image.webPath;
      //imageElement.src = imageUrl;
  }

  async cargaFoto(){
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    var imageUrl = image.webPath;
    //imageElement.src = imageUrl;
  }

}
