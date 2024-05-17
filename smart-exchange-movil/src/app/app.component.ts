import { Component } from '@angular/core';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.initializeApp()
  }

    async initializeApp() {
      if(isPlatform('mobile')){
        StatusBar.setBackgroundColor({color: '#2d47af'})
      }
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  }
}
