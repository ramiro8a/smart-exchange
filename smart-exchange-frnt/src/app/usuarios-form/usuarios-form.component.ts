import { Component,Inject,OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { FormBuilder ,FormGroup, Validators,FormArray  } from '@angular/forms'
import { NotifierService } from 'angular-notifier';
import { UsuariosService } from '../rest/usuarios.service';
import { RolesService } from '../rest/roles.service';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.sass']
})
export class UsuariosFormComponent implements OnInit{
  estaCargando: boolean = false
  usuarioForm: FormGroup;
  hide1: boolean = true
  roles: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UsuariosFormComponent>,
    private notif: NotifierService,
    private dialog: MatDialog,
    private restUsuarios: UsuariosService,
    private restRoles: RolesService,
    @Inject(MAT_DIALOG_DATA) data: any
  ){
    this.usuarioForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      bloqueado: [false, Validators.required],
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      roles: [[], Validators.required]
    }); 
  }

  ngOnInit(): void {
    this.recuperaRoles();
  }

  recuperaRoles():void{
    this.restRoles.recuperaTodo().subscribe({
      next: (response:any) => {
        this.roles = response
      },
      error: (error:any) => {
        this.notif.notify('error', error);
      }
    });
  }

  registra():void{
    if(this.usuarioForm.valid){
      this.estaCargando = true;
      this.restUsuarios.creaUsuario(this.usuarioForm.value).subscribe({
        next: (response:any) => {
          this.estaCargando = false;
          this.notif.notify('success', 'Registros guardados exitosamente');
          this.dialogRef.close(true);
        },
        error: (error:any) => {
          this.estaCargando = false;
          this.notif.notify('error', error);
        }
      });
    }else{
      this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  close(){
    this.dialogRef.close(false);
  }

  get rolesFormArray() {
    return this.usuarioForm.get('roles') as FormArray;
  }

  agregarRol(rolId: number) {
    this.rolesFormArray.push(this.formBuilder.control(rolId));
  }

  removerRol(index: number) {
    this.rolesFormArray.removeAt(index);
  }

}
