import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registrate/registrate.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'registro', component: RegistrateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
