import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      RouterModule.forChild([
        { path: '', component: AboutusComponent },    
      ]) 
   ],
  exports: [
    AboutusComponent
    ],
  declarations: [ 
    AboutusComponent
   ],
  providers: [  ]
})
export class AboutusModule { };