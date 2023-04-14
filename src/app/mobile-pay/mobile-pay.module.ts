import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { AddCardComponent } from './add-card/add-card.component';
import { NewCreditCardComponent } from './new-credit-card/new-credit-card.component';
// import { RecaptchaModule, RecaptchaFormsModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'; 
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { PaymentModule } from '../payments/payment.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanComponent } from './plan/plan.component';
import { MatButtonModule } from '@angular/material/button';
//import { DialogCofirmComponent } from './dialog/dialog-cofirm/dialog-cofirm.component';
import {MatTooltipModule} from '@angular/material/tooltip';
//import { BottomUpComponent } from './dialog/bottom-up/bottom-up.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [
    PaymentComponent, 
    AddCardComponent, 
    NewCreditCardComponent, 
    PlanComponent,
     //DialogCofirmComponent, 
     //BottomUpComponent
    ],
  exports: [AddCardComponent,NewCreditCardComponent,AddCardComponent],
  imports: [
  CommonModule,
	MaterialModule,
  PaymentModule,
  FormsModule,
  ReactiveFormsModule,
  // RecaptchaModule,
  SharedModule,
  MatButtonModule,
  MatTooltipModule,
  MatBottomSheetModule,
	RouterModule.forChild([
	{ path: '', component: PaymentComponent },
	{ path: ':post_data', component: PlanComponent },
	])
  ] 
   
})
export class MobilePayModule { }
