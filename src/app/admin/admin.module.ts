import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewBonoComponent } from './bonos/new-bono/new-bono.component';
import { ListBonoComponent } from './bonos/list-bono/list-bono.component';
import { CalcularBonoComponent } from './bonos/calcular-bono/calcular-bono.component';


@NgModule({
  declarations: [
    LayoutComponent,
    
    NewBonoComponent,
    ListBonoComponent,
    CalcularBonoComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AdminModule { }
