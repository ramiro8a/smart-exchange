import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UsuariosFormComponent } from '../usuarios-form/usuarios-form.component';
import { UsuariosService } from '../rest/usuarios.service';

interface UsuarioResponse{
  id: number;
  creacion: string;
  actualizacion: string;
  version: number;
  estado: number;
  usuario: string;
  correo: string;
  celular: string;
  bloqueado: boolean;
  inicio: Date;
  fin: Date;
  roles: RolResponse[];
}
interface RolResponse{
  id: number;
  nombre: string;
  descripcion: string;
}

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

  }
  editar(usuario:UsuarioResponse){

  }
}
