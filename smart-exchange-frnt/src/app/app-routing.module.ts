import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registrate/registrate.component';
import { UsusariosCrudComponent } from './ususarios-crud/ususarios-crud.component';
import { ReportesComponent } from './reportes/reportes.component'; 
import { OperacionesComponent } from './operaciones/operaciones.component';
import { ClienteComponent } from './cliente/cliente.component'; 
import { PrincipalComponent } from './principal/principal.component';
import { ConfirmaComponent } from './confirma/confirma.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'registro', component: RegistrateComponent },
  {path: 'admin', component: UsusariosCrudComponent },
  {path: 'reportes', component: ReportesComponent },
  {path: 'operaciones', component: OperacionesComponent },
  {path: 'confirma/:token', component: ConfirmaComponent },
  {path: '', component: PrincipalComponent, children: [
    {path: 'cliente', component: ClienteComponent },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
