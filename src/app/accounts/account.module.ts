import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { AddOnetouchSetupDialog } from './dialog/add-Onetouch-setups/add-onetouch-setup-dialog';
import { AddCallForwardDialog } from './dialog/add-call-forward-dialog/add-call-forward-dialog';
import { UpdatePasswordSuccessDialog } from './dialog/update-password-success/update-password-success.dialog';
import { ConfirmPopupDialog } from './dialog/confirm-popup/confirm-popup-dialog';

import { AddEnrollDialog } from './dialog/add-enroll-dialog/add-enroll-dialog';
import { AccountOverviewComponent } from './pages/account-overview/account-overview.component';
import { AccountOverviewPlanInfoComponent } from './components/account-overview-plan-info/account-overview-plan-info.component';
import { AccountPaymentDetailsComponent } from './pages/account-payment-details/account-payment-details.component';
import { AccountOptionsComponent } from './pages/account-options/account-options.component';
import { AddBillingaddDialog } from './dialog/add-billingadd-dialog/add-billingadd-dialog';
import { AccountAutorefillComponent } from './pages/account-autorefill/account-autorefill.component';
import { AccountPlanDetailsComponent } from './pages/account-plan-details/account-plan-details.component';
import { AccountOneTouchComponent } from './pages/account-one-touch/account-one-touch.component';
import { AccountCallForwardingComponent } from './pages/account-call-forwarding/account-call-forwarding.component';
import { AccountMyNumberComponent } from './pages/account-my-number/account-my-number.component';
import { AddNumberNewDialogComponent } from './dialog/add-number-new-dialog/add-number-new-dialog.component';
import { AddNewDialogComponent } from './dialog/add-new-dialog/add-new-dialog.component';
import { AccountInternationalTopupComponent } from './pages/account-international-topup/account-international-topup.component';
import { AccountVirtualnumberComponent } from './pages/account-virtualnumber/account-virtualnumber.component';
import { AccountRewardsComponent } from './pages/account-rewards/account-rewards.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { AddPinlessSetupDialog } from './dialog/add-pinless-setup/add-pinless-setup-dialog';
import { OtherPlansComponent } from './pages/otherPlans/plan-details/other-plans.component';
import { OtherPlansContainerComponent } from './pages/otherPlans/other-plans-container/other-plans-container.component';
import { AccountCallDetailsComponent } from './pages/account-call-details/account-call-details.component';
import { AccountMyProfileComponent } from './pages/account-my-profile/account-my-profile.component';
import { EditOnetouchSetupComponent } from './dialog/edit-onetouch-setup/edit-onetouch-setup.component';
import { AutorefillViewComponent } from './components/autorefill-view/autorefill-view.component';
import { AllAccessNumbersDialog } from './dialog/all-access-numbers/all-access-numbers.dialog';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { AccountPurchaseHistoryComponent } from './pages/account-purchase-history/account-purchase-history.component';
import { EnrollRewardDialog } from './dialog/enroll-reward/enroll-reward.dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CallDetailsComponent } from './pages/call-details/call-details.component';
import { ConfirmMsgDialogComponent } from './dialog/confirm-msg-dialog/confirm-msg-dialog.component';
import { AccountBuyOneGetOneComponent } from './components/account-buy-one-get-one/account-buy-one-get-one.component';
import {MatIconModule} from '@angular/material/icon';
 
import { MobileYourRazaComponent } from './component/mobile-your-raza/mobile-your-raza.component';
//import { MobileCallDetailsComponent } from './component/mobile-call-details/mobile-call-details.component';
import { MobileMyNumbersComponent } from './component/mobile-my-numbers/mobile-my-numbers.component';
import { MobileOnetouchDialComponent } from './component/mobile-onetouch-dial/mobile-onetouch-dial.component';
import { MobileCallFarwordingComponent } from './component/mobile-call-farwording/mobile-call-farwording.component';
import { AccountRechargeComponent } from './pages/account-recharge/account-recharge.component';
 
import { MyCardsComponent } from './pages/my-cards/my-cards.component';
import { WhatIsCvvComponent } from './dialog/what-is-cvv/what-is-cvv.component';
import { AddEditCardComponent } from './dialog/add-edit-card/add-edit-card.component';
 
import { RechargeConfirmationComponent } from './pages/recharge-confirmation/recharge-confirmation.component';
import { ViewratesComponent } from './dialog/viewrates/viewrates.component';
import { AccountSearchRatesComponent } from './pages/account-search-rates/account-search-rates.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import { MobileOrderHistoryComponent } from './component/mobile-order-history/mobile-order-history.component';
// import { MobileRewardsComponent } from './component/mobile-rewards/mobile-rewards.component';
// import { MobileMyaccountComponent } from './component/mobile-myaccount/mobile-myaccount.component';
// import { MobileNotificationsComponent } from './component/mobile-notifications/mobile-notifications.component';
 
@NgModule({
    imports: [
        MaterialModule,
        
        SharedModule,
        CoreModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CreditCardDirectivesModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonToggleModule,
        RouterModule.forChild([
            {
                path: '', component: AccountOverviewComponent, data: { isFixedHeader: true }, children: [
                    { path: '', redirectTo: 'overview', pathMatch: 'full' },
                    // { path: 'overview', component: AccountOptionsComponent },
                    // { path: 'overview/:notification', component: AccountOptionsComponent },

                    { path: 'overview', component: AccountRechargeComponent },
                    { path: 'overview/:notification', component: AccountRechargeComponent },
                    { path: 'recharge/:planId', component: AccountRechargeComponent },
                    
                    
                    { path: 'payment-details/:planId', component: AccountPaymentDetailsComponent },
                    { path: 'payment-details', component: AccountPaymentDetailsComponent },
                    { path: 'order-history', component: AccountPurchaseHistoryComponent },
                    { path: 'autorefill/:planId', component: AccountAutorefillComponent },
                    { path: 'autorefill/:planId', component: AccountAutorefillComponent },
                    { path: 'plandetails/:planId', component: AccountPlanDetailsComponent },
                    { path: 'call-details/:planId', component: CallDetailsComponent },
                    { path: 'mynumber/:planId', component: AccountMyNumberComponent },
                    { path: 'onetouchSetups/:planId', component: AccountOneTouchComponent },
                    { path: 'callForwardingSetups/:planId', component: AccountCallForwardingComponent },
                    { path: 'international-topup', component: AccountInternationalTopupComponent },
                    { path: 'virtualnumber', component: AccountVirtualnumberComponent },
                    { path: 'rewards', component: AccountRewardsComponent },
                    { path: 'my-profile', component: AccountMyProfileComponent },
                    { path: 'confirmation/:orderId', component: RechargeConfirmationComponent},
                    { path: 'rates', component: AccountSearchRatesComponent},

                    
                ]
            },
            { path: 'update-password', component: UpdatePasswordComponent },
            {
                path: 'other-plans', component: OtherPlansContainerComponent,
                children: [
                    { path: '', component: OtherPlansComponent, data: { isVisibleCloseIcon: false } },
                    { path: 'my-numbers/:planId', component: AccountMyNumberComponent, data: { isVisibleCloseIcon: true } },
                    { path: 'onetouchSetups/:planId', component: AccountOneTouchComponent, data: { isVisibleCloseIcon: true } },
                    { path: 'callForwardingSetups/:planId', component: AccountCallForwardingComponent, data: { isVisibleCloseIcon: true } },
                    { path: 'autorefill/:planId', component: AccountAutorefillComponent, data: { isVisibleCloseIcon: true } },
                    { path: 'call-details/:planId', component: AccountCallDetailsComponent, data: { isVisibleCloseIcon: true } },
                ],
                data: { IsFixedHeader: true, isVisibleCloseIcon: false }
            },
        ])
    ],
    exports: [],
    declarations: [
        UpdatePasswordComponent,
        AddOnetouchSetupDialog,
        AddCallForwardDialog,
        UpdatePasswordSuccessDialog,
        ConfirmPopupDialog,
        ConfirmMsgDialogComponent,
        AddEnrollDialog,
        AccountOverviewComponent,
        AccountOverviewPlanInfoComponent,
        AccountPaymentDetailsComponent,
        AccountOptionsComponent,
        AddBillingaddDialog,
        AccountAutorefillComponent,
        AccountOneTouchComponent,
        AccountCallForwardingComponent,
        AccountPlanDetailsComponent,
        AccountMyNumberComponent,
        AddNumberNewDialogComponent,
        AddNewDialogComponent,
        AccountInternationalTopupComponent,
        AccountVirtualnumberComponent,
        AccountRewardsComponent,
        AddPinlessSetupDialog,
        OtherPlansComponent,
        OtherPlansContainerComponent,
        AccountCallDetailsComponent,
        AccountMyProfileComponent,
        EditOnetouchSetupComponent,
        AutorefillViewComponent,
        AllAccessNumbersDialog,
        AccountPurchaseHistoryComponent,
        EnrollRewardDialog,
        CallDetailsComponent,
        AccountBuyOneGetOneComponent,
  
        MobileYourRazaComponent,
       // MobileCallDetailsComponent,
        MobileMyNumbersComponent,
        MobileOnetouchDialComponent,
        MobileCallFarwordingComponent,
        AccountRechargeComponent,
 
        MyCardsComponent,
        WhatIsCvvComponent,
        AddEditCardComponent,
 
        RechargeConfirmationComponent,
           ViewratesComponent,
           AccountSearchRatesComponent,
 
        // MobileOrderHistoryComponent,
        // MobileRewardsComponent,
        // MobileMyaccountComponent,
        // MobileNotificationsComponent,
    ],
    providers: [DatePipe]
})
export class AccountModule { };