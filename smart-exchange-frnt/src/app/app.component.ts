import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Empresa } from './rest/empresa.service';
import { UsuariosService } from './rest/usuarios.service';
import { TokenService } from './servicios/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit{
  title = 'LC exchange';
  logo_principal='assets/img/lc_excahnge_temp.jpg'
  whatsapp_logo='assets/img/whatsapp_logo.png'
  url_watsapp!:string

  constructor(
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private restUsuario: UsuariosService,
    private tokenService: TokenService
    ) {
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
      }, 500);  //1000 1 seg
    });
  }

  ngOnInit(): void {
    this.recuperaEmpresa()
  }

  esCliente():boolean{
    return this.tokenService.esCliente();
  }

  recuperaEmpresa():void{
     this.restUsuario.recuperaEmpresa().subscribe({
      next: (response:Empresa) => {
        this.url_watsapp = response.whatsapp;
      },
      error: (error:any) => {
        console.error(error)
      }
    });
  }

}
