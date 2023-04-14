import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { FeaturesComponent } from './features/features.component';
import { FaqPageComponent } from './dialog/faq-page/faq-page.component';
import { HowWorksComponent } from './dialog/how-works/how-works.component';
import { SetitupComponent } from './dialog/setitup/setitup.component';
import {  FeaturesTabComponent } from '../shared/features-tab/features-tab.component';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [ 
      MaterialModule,
      SharedModule,      
      MatButtonModule,      
      RouterModule.forChild([
        { path: '', component: FeaturesComponent },    
      ]) 
   ],
  exports: [
    FeaturesComponent,
    MatButtonModule,
    ],
  declarations: [ 
    FeaturesComponent,
    FaqPageComponent, 
    HowWorksComponent,
    SetitupComponent,
    FeaturesTabComponent
   ],
  providers: [  ],
  entryComponents : [
    FaqPageComponent, 
    HowWorksComponent 
  ]
})
export class FeaturesModule { };