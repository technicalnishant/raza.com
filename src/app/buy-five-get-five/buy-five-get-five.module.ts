import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyFiveGetFiveComponent } from '../buy-five-get-five/buy-five-get-five.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
 
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BuyFiveGetFiveComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    RouterModule.forChild([{path:'', component:BuyFiveGetFiveComponent}])
  ]
})
export class BuyFiveGetFiveModule { }
