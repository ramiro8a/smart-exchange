import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'mis-operaciones',
        loadChildren: () => import('../mis-operaciones/mis-operaciones.module').then(m => m.MisOperacionesPageModule)
      },
      {
        path: 'cliente',
        loadChildren: () => import('../cliente/cliente.module').then(m => m.ClientePageModule)
      },
      {
        path: 'lista-cuentas',
        loadChildren: () => import('../lista-cuentas-bancarias/lista-cuentas-bancarias.module').then(m => m.ListaCuentasBancariasPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/cliente',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/cliente',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
