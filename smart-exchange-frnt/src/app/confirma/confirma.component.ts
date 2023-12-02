import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../rest/usuarios.service';
import { Router, ActivatedRoute } from "@angular/router";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-confirma',
  templateUrl: './confirma.component.html',
  styleUrls: ['./confirma.component.sass']
})
export class ConfirmaComponent implements OnInit {
  estaCargando: boolean = true

  constructor(private restUsuarios: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private notif: NotifierService){

  }

  ngOnInit(): void {
    if(this.activatedRoute?.snapshot?.params['token']){
      let tokenConfirm = this.activatedRoute.snapshot.params['token']
      console.warn(tokenConfirm)
      this.restUsuarios.confirmaCorreo(tokenConfirm).subscribe({
        next: (response:any) => {
          this.estaCargando = false;
        },
        error: (error:any) => {
          this.notif.notify('error', error);
        }
      });
    }else{
      window?.top?.close()
    }
  }

  cierra():void{
    window?.top?.close()
  }

}
