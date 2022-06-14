import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBonoComponent } from './bonos/edit-bono/edit-bono.component';
import { ListBonoComponent } from './bonos/list-bono/list-bono.component';
import { NewBonoComponent } from './bonos/new-bono/new-bono.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
    {
      path:'bonos',
      component:ListBonoComponent,
    },
    {
      path:'bonos/nuevo',
      component:NewBonoComponent,
    },
    {
      path:'bonos/:id/editar',
      component:EditBonoComponent,
    },
    //{
      //path:'usuario',
      //component:UsuarioInfoComponent
    //},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
