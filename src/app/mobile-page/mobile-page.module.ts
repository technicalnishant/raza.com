import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobilePageComponent } from './mobile-page/mobile-page.component';
import { RouterModule } from '@angular/router';
 
import { MaterialModule } from '../core/material.module';


@NgModule({
  declarations: [
    
  
    MobilePageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      {path:'', component:MobilePageComponent}
    ])
  ]
  
})
export class MobilePageModule { }
