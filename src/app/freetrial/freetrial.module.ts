import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';

import { FreeTrialService } from './freetrial.service';
import { FreeTrialComponent } from './freetrial/freetrial.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
	  MatAutocompleteModule,
	  FormsModule,
	  ReactiveFormsModule,
      RouterModule.forChild([
        { path: '', component: FreeTrialComponent },    
      ]) 
   ],
  exports: [
    FreeTrialComponent
    ],
  declarations: [ 
    FreeTrialComponent
   ],
  providers: [ 
    FreeTrialService 
  ],
  entryComponents : []
})
export class FreeTrialModule { };