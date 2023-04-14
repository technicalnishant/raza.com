import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { TermsandconditionComponent } from './termsandcondition/termsandcondition.component';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      RouterModule.forChild([
        { path: '', component: TermsandconditionComponent },    
      ]) 
   ],
  exports: [
    TermsandconditionComponent
    ],
  declarations: [ 
    TermsandconditionComponent
   ],
  providers: [  ]
})
export class TermsandconditionModule { };