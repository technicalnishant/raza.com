import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { CallasiaComponent } from './callasia/callasia.component';
import { CallasiaNewComponent } from './callasia-new/callasia-new.component';

@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    RouterModule.forChild([
     // { path: '', component: CallasiaComponent },
      { path: '', component: CallasiaNewComponent },
      { path: 'new', component: CallasiaNewComponent },
    ])
  ],
  exports: [
    CallasiaComponent
  ],
  declarations: [
    CallasiaComponent,
    CallasiaNewComponent
  ],
  providers: [],
  entryComponents: [

  ]
})
export class CallasiaModule { };