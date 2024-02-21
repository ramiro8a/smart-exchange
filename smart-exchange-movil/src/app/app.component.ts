import { Component } from '@angular/core';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';

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
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
  }
}
