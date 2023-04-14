import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HowitworksComponent } from './howitworks/howitworks.component';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      RouterModule.forChild([
        { path: '', component: HowitworksComponent },    
      ]) 
   ],
  exports: [
    HowitworksComponent
    ],
  declarations: [ 
    HowitworksComponent
   ],
  providers: [  ]
})
export class HowitworksModule { };