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
import { ListaCuentasBancariasComponent } from './cliente/lista-cuentas-bancarias/lista-cuentas-bancarias.component';
import { AdminGuard, ClienteGuard, GerenteGuard, OperadorGuard } from './utils/auht.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'registro', component: RegistrateComponent },
  {path: 'confirma/:token', component: ConfirmaComponent },
  {path: '', component: PrincipalComponent, children: [
    {path: 'reportes', component: ReportesComponent, canActivate:[GerenteGuard] },
    {path: 'cliente', children:[
      {path: 'nueva-operacion', component: ClienteComponent },
      {path: 'cuentas-bancarias', component: ListaCuentasBancariasComponent },
    ], canActivate:[ClienteGuard] },
    {path: 'operaciones', children: [
      {path: 'principal', component: OperacionesComponent },
      {path: 'tipo-cambio', component: TipoCambioComponent }
    ], canActivate:[OperadorGuard]},
    {path: 'admin', component: UsusariosCrudComponent, canActivate:[AdminGuard] },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
