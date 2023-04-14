import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { FaqComponent } from './faq/faq.component';



@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      RouterModule.forChild([
        { path: '', component: FaqComponent },    
      ]) 
   ],
  exports: [
   FaqComponent
    ],
  declarations: [ 
    FaqComponent,
   ],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [  ]
})
export class FaqModule { };