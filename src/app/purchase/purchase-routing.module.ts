import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { PaymentInfoComponent } from './pages/payment-info/payment-info.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { PurchaseConfirmationComponent } from './pages/purchase-confirmation/purchase-confirmation.component';


@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: RegisterComponent },
            { path: 'payment-info', component: PaymentInfoComponent, canActivate: [AuthGuard] },
            { path: 'confirmation', component: PurchaseConfirmationComponent, canActivate: [AuthGuard] }
        ])
    ]
})
export class PurchaseRoutingModule { }
