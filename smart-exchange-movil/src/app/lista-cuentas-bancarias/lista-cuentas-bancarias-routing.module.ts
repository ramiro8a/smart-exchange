import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaCuentasBancariasPage } from './lista-cuentas-bancarias.page';

const routes: Routes = [
  {
    path: '',
    component: ListaCuentasBancariasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaCuentasBancariasPageRoutingModule {}
