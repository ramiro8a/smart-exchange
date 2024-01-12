import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'LC exchange';
  logo_principal='assets/img/lc_excahnge_temp.jpg'
  whatsapp_logo='assets/img/whatsapp_logo.png'

  constructor(private router: Router, private ngxService: NgxUiLoaderService,) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.ngxService.start();
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        this.ngxService.stop();
      }, 1000);  //500 1 seg
    });
  }

}
