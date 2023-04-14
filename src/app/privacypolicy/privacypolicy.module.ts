import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      RouterModule.forChild([
        { path: '', component: PrivacypolicyComponent },    
      ]) 
   ],
  exports: [
    PrivacypolicyComponent
    ],
  declarations: [ 
    PrivacypolicyComponent
   ],
  providers: [  ]
})
export class PrivacypolicyModule { };