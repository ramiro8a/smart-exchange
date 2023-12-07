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
import { TipoCambioComponent } from './operaciones/tipo-cambio/tipo-cambio.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'registro', component: RegistrateComponent },
  {path: 'reportes', component: ReportesComponent },
  {path: 'confirma/:token', component: ConfirmaComponent },
  {path: '', component: PrincipalComponent, children: [
    {path: 'cliente', component: ClienteComponent },
    {path: 'operaciones', component: OperacionesComponent, children: [
      {path: 'tipo-cambio', component: TipoCambioComponent },
    ]},
    {path: 'admin', component: UsusariosCrudComponent },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
