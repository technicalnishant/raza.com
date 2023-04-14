import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { MobiletermsComponent } from './mobileterms/mobileterms.component';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      RouterModule.forChild([
        { path: '', component: MobiletermsComponent },    
      ]) 
   ],
  exports: [
    MobiletermsComponent
    ],
  declarations: [ 
    MobiletermsComponent
   ],
  providers: [  ]
})
export class MobiletermsModule { };