import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from '../page404/page404.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [Page404Component],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'', component:Page404Component}])
  ]
})
export class Page404Module { }
