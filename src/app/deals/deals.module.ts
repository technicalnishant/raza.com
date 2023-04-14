import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { FaqPageComponent } from './dialog/faq-page/faq-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndiaOneCentComponent } from './pages/india-one-cent/india-one-cent.component';
import { PromationNowComponent } from './pages/promation-now/promation-now.component';


import { IndiaUnlimitedComponent } from './pages/india-unlimited/india-unlimited.component';
import { PromotionResolverService } from './services/promotion-resolver.service';
import { PromotionHostDirective } from './directive/promotion-host.directive';
import { PromotionHostComponent } from './pages/promotion-host/promotion-host.component';
import { StandardPromotionComponent } from './pages/standard-promotion/standard-promotion.component';
import { GridViewPromotionComponent } from './pages/grid-view-promotion/grid-view-promotion.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Buy5get5Component } from './pages/buy5get5/buy5get5.component';
import { GuyanaComponent } from './pages/guyana/guyana.component';
import { CommanFaqsComponent } from 'app/shared/components/comman-faqs/comman-faqs.component';
import { Buy5popupComponent } from '../globalrates/buy5popup/buy5popup.component';

import { MobiledealsComponent } from '../mobiledeals/mobiledeals.component'; 


@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    RouterModule.forChild([
      { path: ':promotionCode', component: PromotionHostComponent },
      { path: 'page/guyana', component: GuyanaComponent },
    ])
  ],
  exports: [
    CommanFaqsComponent
  ],
  declarations:
    [
      FaqPageComponent,
      Buy5popupComponent,
      StandardPromotionComponent,
      IndiaOneCentComponent,
      PromationNowComponent,
      IndiaUnlimitedComponent,
      PromotionHostComponent,
      PromotionHostDirective,
      GridViewPromotionComponent,
      Buy5get5Component,
      GuyanaComponent,
      CommanFaqsComponent,
      MobiledealsComponent
    ],
  providers: [
    PromotionResolverService
  ],
  entryComponents:
    [
      FaqPageComponent,
      IndiaOneCentComponent,
      PromationNowComponent,
      IndiaUnlimitedComponent,
      StandardPromotionComponent,
      GridViewPromotionComponent,
      GuyanaComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DealsModule { };