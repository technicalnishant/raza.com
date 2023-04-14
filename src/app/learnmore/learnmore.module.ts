import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnmoreComponent } from '../globalrates/learnmore/learnmore.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { DealsModule } from './deals/deals.module';
import { SharedModule } from '../shared/shared.module';
 

@NgModule({
  declarations: [LearnmoreComponent],
  imports: [
    CommonModule,
    
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    RouterModule.forChild([{path:'', component:LearnmoreComponent}])
  ]
})
export class LearnmoreModule { }
