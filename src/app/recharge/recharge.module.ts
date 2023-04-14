import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RechargeComponent } from './pages/recharge/recharge.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { RechargePaymentComponent } from './pages/recharge-payment/recharge-payment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RechargeConfirmationComponent } from './pages/recharge-confirmation/recharge-confirmation.component';
import { PaymentModule } from '../payments/payment.module';
import { QuickRechargeComponent } from './pages/quick-recharge/quick-recharge.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RechargeRewardComponent } from './pages/recharge-reward/recharge-reward.component';
import { RechargeRewardService } from './services/recharge-reward.Service';
import { RewardRedeemConfirmDialog } from '../accounts/dialog/reward-redeem-confirm/reward-redeem-confirm-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BonusMinutesComponent } from './pages/bonus-minutes/bonus-minutes.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        PaymentModule,
        SharedModule,
        MatButtonModule,
        CarouselModule,
        RouterModule.forChild([
            { path: 'quick', component: QuickRechargeComponent },
            { path: ':planId', component: RechargeComponent, canActivate: [AuthGuard] },
            { path: 'reward/:planId', component: RechargeRewardComponent, canActivate: [AuthGuard] },
            { path: 'payment/:planId', component: RechargePaymentComponent, canActivate: [AuthGuard] },
            { path: 'confirmation/:orderId', component: RechargeConfirmationComponent, canActivate: [AuthGuard] }
        ])
    ],
    exports: [],
    declarations: [
        RechargeComponent,
        RechargeRewardComponent,
        RechargePaymentComponent,
        RechargeConfirmationComponent,
        QuickRechargeComponent,RewardRedeemConfirmDialog, BonusMinutesComponent
    ],
    providers: [RechargeRewardService],
    entryComponents: [RewardRedeemConfirmDialog]
})
export class RechargeModule { }
