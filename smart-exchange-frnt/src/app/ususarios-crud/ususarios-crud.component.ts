import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UsuariosFormComponent } from '../usuarios-form/usuarios-form.component';
import { UsuariosService, UsuarioResponse } from '../rest/usuarios.service';
import { NotifierService } from 'angular-notifier';
import { CambioPasswordComponent } from '../ui-utils/cambio-password/cambio-password.component';

@Component({
  selector: 'app-ususarios-crud',
  templateUrl: './ususarios-crud.component.html',
  styleUrls: ['./ususarios-crud.component.sass']
})

export class UsusariosCrudComponent implements OnInit{
  estaCargando: boolean = false
  dataSource: UsuarioResponse[] = [];
  displayedColumns: string[] = ['creacion', 'actualizacion','usuario', 'correo', 'bloqueado', 'inicio', 'fin', 'roles','opciones'];

  constructor(
    private dialog: MatDialog,
    private notif: NotifierService,
    private restUsuarios: UsuariosService
    ){}

    ngOnInit(): void {
      this.recuperaUsuarios();
    }

  abreFormulario():void{
    const dialogConfig = new MatDialogConfig();
        //dialogConfig.data=response.url
        const dialogRef = this.dialog.open(UsuariosFormComponent, dialogConfig)
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.recuperaUsuarios();
          }
    })
  }

  recuperaUsuarios():void{
    this.restUsuarios.recuperaUsuarios().subscribe({
      next: (response:any) => {
        this.dataSource = response as UsuarioResponse[]
      },
      error: (error:any) => {
      }
    });
  }

  cambioPassword(usuario:UsuarioResponse){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      id: usuario.id
    }
    const dialogRef = this.dialog.open(CambioPasswordComponent, dialogConfig)
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
      }
    })
  }

  editar(usuario:UsuarioResponse){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.data=usuario
        const dialogRef = this.dialog.open(UsuariosFormComponent, dialogConfig)
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.recuperaUsuarios();
          }
    })
  }

  bloqueo(usuario:UsuarioResponse):void{
    this.estaCargando = true
    this.restUsuarios.bloqueoUsuario(usuario.id, usuario.bloqueado).subscribe({
      next: (response:any) => {
        this.recuperaUsuarios();
        this.estaCargando = false
      },
      error: (error:any) => {
        usuario.bloqueado = !usuario.bloqueado
        this.notif.notify('error', error);
        this.estaCargando = false
      }
    });
  }
}
