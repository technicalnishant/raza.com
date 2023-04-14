import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MessageUsComponent } from './dialog/message-us/message-us.component';
import { MessageUsAllComponent } from './dialog/message-us-all/message-us-all.component';


//import { LandingPageService } from './landing-page.service';



@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: LandingPageComponent },
    ])
  ],
  exports: [
    LandingPageComponent
  ],
  declarations: [
    LandingPageComponent,
    MessageUsComponent,
    MessageUsAllComponent,
  ],
  providers: [],
  entryComponents: [
    MessageUsComponent,
    MessageUsAllComponent
  ]
})
export class LandingPageModule { };