import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalcularBonoComponent } from './bonos/calcular-bono/calcular-bono.component';
import { ListBonoComponent } from './bonos/list-bono/list-bono.component';
import { NewBonoComponent } from './bonos/new-bono/new-bono.component';
import { ResultsBonoComponent } from './bonos/results-bono/results-bono/results-bono.component';
import { UsuarioInfoComponent } from './bonos/usuario-info/usuario-info/usuario-info.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
    {
      path:'bonos/:id',
      component:ListBonoComponent,
    },
    {
      path:'bonos/nuevo',
      component:NewBonoComponent,
    },
    {
      path:'bonos/calcular/:id',
      component:CalcularBonoComponent,
    },
    {
      path:'bonos/resultados/:id',
      component: ResultsBonoComponent,
    },
    {
      path:'usuario',
      component:UsuarioInfoComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
