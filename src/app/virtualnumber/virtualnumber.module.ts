import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { VirtualnumberComponent, OpenVNLists } from './virtualnumber/virtualnumber.component';
import { VirtualnumberSuccessComponent } from './virtualnumber-success/virtualnumber-success.component';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      RouterModule.forChild([
        { path: '', component: VirtualnumberComponent },    
        // { path: '', component: VirtualnumberSuccessComponent },   
      ]) 
   ],
  exports: [
    VirtualnumberComponent
    ],
  declarations: [ 
    VirtualnumberComponent,VirtualnumberSuccessComponent,
    OpenVNLists
   ],
  providers: [ 
     
  ],
  entryComponents : [OpenVNLists]
})
export class VirtualnumberModule { };