import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { currencySmallSymbolPipe, currencyMainSymbolPipe } from './pipes/currencySymbol.pipe';
import { creditCardsPipe, creditCardStrPipe, creditCardMaskPipe } from './pipes/creditCards.pipe';
import { PaymentFailedDialogComponent } from '../payments/dialogs/payment-failed-dialog/payment-failed-dialog.component';
import { MaterialModule } from '../core/material.module';
import { EditBillingInfoDialog } from '../accounts/dialog/edit-billing-info-dialog/edit-billing-info-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCreditcardDialog } from '../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog';
import { pinNumberPipe } from './pipes/pinNumber.pipe';
import { CardTypeIconComponent } from './components/card-type-icon/card-type-icon.component';
import { OtpConfirmationComponent } from './dialog/otp-confirmation/otp-confirmation.component';
import { NotificationRibbonComponent } from './dialog/notification-ribbon/notification-ribbon.component';
import { NotificationDialogComponent } from './dialog/notification-dialog/notification-dialog.component';
import { ReportanissueDialogComponent } from './dialog/reportanissue-dialog/reportanissue-dialog.component';

import { FaqGenericComponent } from './components/faq-generic/faq-generic.component';
import { DealPopupViewComponent } from './components/deal-popup-view/deal-popup-view.component';
import { PasswordBoxComponent } from './dialog/password-box/password-box.component';
import { UpdatePasswordDialog } from '../accounts/dialog/update-password/update-password';
import { AddCreditcardPayDialog } from '../accounts/dialog/add-creditcard-pay-dialog/add-creditcard-pay-dialog';

import { FaqPageComponent } from './dialog/faq-page/faq-page.component';
import { HowWorksComponent } from './dialog/how-works/how-works.component';
import { AutocompleteComponent } from '../google-places.component';
import { CustomErrorComponent } from './dialog/custom-error/custom-error.component';
// import { DealsTabComponent } from './deals-tab/deals-tab.component';
//import { FeaturesTabComponent } from './features-tab/features-tab.component';
//import { TestimonialsComponent } from './testimonials/testimonials.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  declarations: [
    pinNumberPipe,
    creditCardsPipe,
    creditCardMaskPipe,
    currencySmallSymbolPipe,
    currencyMainSymbolPipe,
    creditCardStrPipe,
    PaymentFailedDialogComponent,
    EditBillingInfoDialog,
    AddCreditcardDialog,
    CardTypeIconComponent,
    OtpConfirmationComponent,
    NotificationRibbonComponent,
    NotificationDialogComponent,
    ReportanissueDialogComponent,
    FaqGenericComponent,
    DealPopupViewComponent,
    PasswordBoxComponent,
    UpdatePasswordDialog,
    AddCreditcardPayDialog,
	  FaqPageComponent, 
    HowWorksComponent,
    AutocompleteComponent,
    CustomErrorComponent,
    // DealsTabComponent,
    //FeaturesTabComponent,
    //TestimonialsComponent
  ],
  exports: [
    pinNumberPipe,
    CommonModule,
    creditCardsPipe,
    creditCardMaskPipe,
    currencySmallSymbolPipe,
    currencyMainSymbolPipe,
    creditCardStrPipe,
    PaymentFailedDialogComponent,
    CardTypeIconComponent,
    OtpConfirmationComponent,
    FaqGenericComponent,
    PasswordBoxComponent,

  ],
  entryComponents: [
    PaymentFailedDialogComponent,
    EditBillingInfoDialog,
    AddCreditcardDialog,
    OtpConfirmationComponent,
    NotificationRibbonComponent,
    NotificationDialogComponent,
    ReportanissueDialogComponent,
    DealPopupViewComponent,
    PasswordBoxComponent,
    UpdatePasswordDialog,
    AddCreditcardPayDialog,
	FaqPageComponent, 
    HowWorksComponent, 
    AutocompleteComponent
  ],
  providers: []
})
export class SharedModule { };
