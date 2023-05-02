import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';

import { FreeTrialService } from './freetrial.service';
import { FreeTrialComponent } from './freetrial/freetrial.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FreetrialNewComponent } from './freetrial-new/freetrial-new.component';
@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
	  MatAutocompleteModule,
	  FormsModule,
	  ReactiveFormsModule,
      RouterModule.forChild([
        { path: '', component: FreeTrialComponent },    
        { path: 'new', component: FreetrialNewComponent },    
      ]) 
   ],
  exports: [
    FreeTrialComponent
    ],
  declarations: [ 
    FreeTrialComponent, FreetrialNewComponent
   ],
  providers: [ 
    FreeTrialService 
  ],
  entryComponents : []
})
export class FreeTrialModule { };