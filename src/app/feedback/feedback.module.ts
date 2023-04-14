import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forChild([
        { path: '', component: FeedbackComponent },    
      ]) 
   ],
  exports: [
    FeedbackComponent
    ],
  declarations: [ 
    FeedbackComponent
   ],
  providers: [  ]
})
export class FeedbackModule { };