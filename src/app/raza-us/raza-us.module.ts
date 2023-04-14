import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRatesComponent } from './search-rates/search-rates.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SearchRatesComponent
  ],
  
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SearchRatesComponent },
     
      ])
  ]
  
})
export class RazaUsModule { }
