import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { CallafricaComponent } from './callafrica/callafrica.component';
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
        { path: '', component: CallafricaComponent },    
      ]) 
   ],
  exports: [
    CallafricaComponent
    ],
  declarations: [ 
    CallafricaComponent,
   ],
  providers: [  ],
  entryComponents : [

  ]
})
export class CallafricaModule { };