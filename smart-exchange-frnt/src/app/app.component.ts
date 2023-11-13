import { Component } from '@angular/core';
import {trigger, animate, style, group, animateChild, query, stagger, transition, state} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'LC exchange';
  logo_principal='assets/img/lc_excahnge_temp.jpg'
  whatsapp_logo='assets/img/whatsapp_logo.png'
}
