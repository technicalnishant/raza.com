import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobiletopupService } from './mobiletopup.service';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MobiletopupComponent } from './pages/mobiletopup/mobiletopup.component';
import { TopupNowComponent } from './pages/topup-now/topup-now.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgxSplideModule } from 'ngx-splide';
import { PromoComponent } from './dialog/promo/promo.component';
import { TopupDialogComponent } from './dialog/topup-dialog/topup-dialog.component';
import { BundleDialogComponent } from './dialog/bundle-dialog/bundle-dialog.component';
@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    NgxSplideModule,
    RouterModule.forChild([
      { path: '', component: MobiletopupComponent },
      { path: '/mobiletopup/:planid/:iso', component: MobiletopupComponent },
      { path: '/mobiletopup/:pin', component: MobiletopupComponent },
      { path: 'topup_now', component: TopupNowComponent },
       
    ])
  ],
  exports: [
    
  ],
  declarations: [
    MobiletopupComponent,
    TopupNowComponent,
    PromoComponent,
    TopupDialogComponent,
    BundleDialogComponent
  ],
  providers: [MobiletopupService]
})
export class MobiletopupModule { };