import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutRegisterComponent } from './pages/register/checkout-register.component';
import { CheckoutConfirmationComponent } from './pages/purchase-confirmation/checkout-confirmation.component';
import { CheckoutPaymentComponent } from './pages/payment-info/checkout-payment.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { CartResolverService } from './services/cart-resolver.service';
import { CartRequireGuard } from './guards/cart-require.guard';
import { PaymentOptionsComponent } from './pages/payment-info/payment-options/payment-options.component';
import { PinlessSwitchComponent } from './pages/payment-info/pinless-switch/pinless-switch.component';
import { FreetrialConfirmationComponent } from './pages/freetrial-confirmation/freetrial-confirmation.component';
import { MotoConfirmationComponent } from './pages/moto-confirmation/moto-confirmation.component';
@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: CheckoutRegisterComponent },
            {
                path: 'payment-info', component: CheckoutPaymentComponent,
                canActivate: [AuthGuard, CartRequireGuard],
                resolve: { cart: CartResolverService },
                children: [
                    { path: '', component: PaymentOptionsComponent },
                    { path: 'switch-pinless', component: PinlessSwitchComponent }
                ]
            },
            { path: 'confirmation/:orderId', component: CheckoutConfirmationComponent, canActivate: [AuthGuard] },
            { path: 'motoconfirmation/:orderId', component: MotoConfirmationComponent, canActivate: [AuthGuard] },
            {path:'freetrial_confirmation/:orderId', component: FreetrialConfirmationComponent, canActivate: [AuthGuard]  }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CheckoutRoutingModule { }
