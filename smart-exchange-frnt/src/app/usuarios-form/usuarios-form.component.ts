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
  id: number = 0

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
    if(data?.id){
      this.id=data.id
      console.log(data)
      this.usuarioForm.controls['correo'].setValue(data.correo);
      this.usuarioForm.controls['inicio'].setValue(data.inicio);
      this.usuarioForm.controls['fin'].setValue(data.fin);
      let rolesIDs: number[] = []
      data.roles.forEach((element:any) => {
        rolesIDs.push(element.id)
      });
      console.log(rolesIDs)
      this.usuarioForm.controls['roles'].setValue(rolesIDs);
    }
  }

  ngOnInit(): void {
    if(!this.esNuevo()){
      this.usuarioForm.controls['usuario'].setValidators([]);
      this.usuarioForm.controls['password'].setValidators([]);
      this.usuarioForm.controls['bloqueado'].setValidators([]);
      this.usuarioForm.updateValueAndValidity();
    }
    this.recuperaRoles();
  }

  esNuevo(){
    return this.id==0
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
      if(this.esNuevo()){
        this.crearUsuario()
      }else{
        this.editaUsuario()
      }
    }else{
      this.notif.notify('warning','Complete el formulario por favor');
    }
  }

  editaUsuario(){
    this.estaCargando = true;
    this.restUsuarios.editaUsuario(this.id, this.usuarioForm.value).subscribe({
      next: (response:any) => {
        this.estaCargando = false;
        this.notif.notify('success', 'Registros actulizados exitosamente');
        this.dialogRef.close(true);
      },
      error: (error:any) => {
        this.estaCargando = false;
        this.notif.notify('error', error);
      }
    });
  }

  crearUsuario():void{
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
