import { NgModule } from '@angular/core';
import { PaymentFailedDialogComponent } from './dialogs/payment-failed-dialog/payment-failed-dialog.component';
import { PaypalPaymentBoxComponent } from './components/paypal-payment-box/paypal-payment-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { RazaPaypalModule } from './paypal/raza-paypal.module';
import { NewCreditCardPaymentBoxComponent } from './components/new-credit-card-payment-box/new-credit-card-payment-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { MatButtonModule } from '@angular/material/button';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NoCardPaymentBoxComponent } from './components/no-card-payment-box/no-card-payment-box.component';

@NgModule({

    imports: [
        MaterialModule,
        SharedModule,
        RazaPaypalModule,
        FormsModule,
        ReactiveFormsModule,
        CreditCardDirectivesModule,
        MatButtonModule,
        MatProgressBarModule
        
    ],
    exports: [
        RazaPaypalModule,
        PaypalPaymentBoxComponent,
        NewCreditCardPaymentBoxComponent,
		NoCardPaymentBoxComponent
    ],
    declarations: [
        PaypalPaymentBoxComponent,
        NewCreditCardPaymentBoxComponent,
        NoCardPaymentBoxComponent
    ],
})
export class PaymentModule { }
