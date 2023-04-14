import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { SearchratesComponent } from './searchrates/searchrates.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      RouterModule.forChild([
        { path: '', component: SearchratesComponent }
      ]) 
   ],
  exports: [
    ],
  declarations: [
    SearchratesComponent
   ],
  providers: [  ],
  entryComponents : [ ]
})
export class SearchratesModule { };