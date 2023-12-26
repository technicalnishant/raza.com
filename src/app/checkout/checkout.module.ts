import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutRegisterComponent } from './pages/register/checkout-register.component';
import { CheckoutPaymentComponent } from './pages/payment-info/checkout-payment.component';
import { CheckoutConfirmationComponent } from './pages/purchase-confirmation/checkout-confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../core/material.module';
import { PaymentModule } from '../payments/payment.module';
import { RedeemPromoComponent } from './components/redeem-promo/redeem-promo.component';
import { RechargeConfirmationComponent } from './components/recharge-confirmation/recharge-confirmation.component';
import { PurchaseConfirmationComponent } from './components/purchase-confirmation/purchase-confirmation.component';
import { CartRequireGuard } from './guards/cart-require.guard';
import { PaymentOptionsComponent } from './pages/payment-info/payment-options/payment-options.component';
import { PinlessSwitchComponent } from './pages/payment-info/pinless-switch/pinless-switch.component';
import { MobileTopupConfirmationComponent } from './components/mobile-topup-confirmation/mobile-topup-confirmation.component';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { NgxBraintreeModule } from 'ngx-braintree';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FreetrialConfirmationComponent } from './pages/freetrial-confirmation/freetrial-confirmation.component';
import { MotoConfirmationComponent } from './pages/moto-confirmation/moto-confirmation.component';
import { SetCartComponent } from './set-cart/set-cart.component';
@NgModule({
  declarations: [
    CheckoutRegisterComponent,
    CheckoutPaymentComponent,
    CheckoutConfirmationComponent,
    RedeemPromoComponent,
    RechargeConfirmationComponent,
    PurchaseConfirmationComponent,
    PinlessSwitchComponent,
    PaymentOptionsComponent,
    MobileTopupConfirmationComponent,
    FreetrialConfirmationComponent,
    MotoConfirmationComponent,
    SetCartComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PaymentModule,
    CheckoutRoutingModule,
    RecaptchaV3Module,
    NgxBraintreeModule,
    MatButtonModule,
    MatProgressBarModule
    
  ],
  entryComponents: [RedeemPromoComponent, PinlessSwitchComponent]
})
export class CheckoutModule { }
