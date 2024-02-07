import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisOperacionesPage } from './mis-operaciones.page';

const routes: Routes = [
  {
    path: '',
    component: MisOperacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisOperacionesPageRoutingModule {}
