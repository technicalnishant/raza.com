import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { CallasiaComponent } from './callasia/callasia.component';

@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    RouterModule.forChild([
      { path: '', component: CallasiaComponent },
    ])
  ],
  exports: [
    CallasiaComponent
  ],
  declarations: [
    CallasiaComponent
  ],
  providers: [],
  entryComponents: [

  ]
})
export class CallasiaModule { };