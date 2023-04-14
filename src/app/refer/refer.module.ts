import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReferafriendComponent } from './referafriend/referafriend.component';
import { Referafriend2Component } from './referafriend2/referafriend2.component';
import { RefferComponent } from './reffer/reffer.component';
  // import { SharethisAngularModule } from 'sharethis-angular';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      //  SharethisAngularModule,
      RouterModule.forChild([
        // { path: '', component: ReferafriendComponent }, 
        { path: '', component: Referafriend2Component } ,  
        {path:'reffer_a_friend', component: RefferComponent}
      ]) 
   ],
  exports: [

    ],
  declarations: [ 
    ReferafriendComponent,Referafriend2Component, RefferComponent
   ],
  providers: [  ]
})
export class ReferModule { };