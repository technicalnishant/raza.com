import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { BecomeapartnerComponent } from './becomeapartner/becomeapartner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule, 
      RouterModule.forChild([
        { path: '', component: BecomeapartnerComponent },    
      ]) 
   ],
  exports: [
    BecomeapartnerComponent
    ],
  declarations: [ 
    BecomeapartnerComponent
   ],
  providers: [  ]
})
export class BecomeapartnerModule { };