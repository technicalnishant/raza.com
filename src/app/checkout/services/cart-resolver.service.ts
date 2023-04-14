import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { CheckoutService } from "./checkout.service";
import { ICheckoutModel, NewPlanCheckoutModel, RechargeCheckoutModel } from "../models/checkout-model";
import { Observable } from "rxjs";
import { PlanService } from "../../accounts/services/planService";
import { TransactionType } from "../../payments/models/transaction-request.model";
//import { isNullOrUndefined } from "util";
import { Plan } from "../../accounts/models/plan";
import { RazaSnackBarService } from "../../shared/razaSnackbar.service";
import { PlanType } from "../../accounts/models/PlanType";
import { AuthenticationService } from "../../core/services/auth.service";
import { isNullOrUndefined } from "../../shared/utilities";

@Injectable({
    providedIn: 'root'
})
export class CartResolverService implements Resolve<any> {
    constructor(
        private checkoutService: CheckoutService,
        private planService: PlanService,
        private snackBarService: RazaSnackBarService,
        private authService: AuthenticationService,
        private router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let cart: ICheckoutModel;
        this.checkoutService.getCurrentCart().subscribe(res => {
            cart = res;
        });

        if (isNullOrUndefined(cart)) {
            return;
        }

        return new Observable((observer) => {
            if (cart.transactiontype === TransactionType.Activation || cart.transactiontype === TransactionType.Sale) {
                this.planService.getPlanByCardId((cart as NewPlanCheckoutModel).CardId)
                    .toPromise().then((res: Plan) => {
                        if (!isNullOrUndefined(res) && res.PlanType === PlanType.Signature) 
						{
							
                            const model = this.updateCartForRecharge(res, (cart as NewPlanCheckoutModel))
							var code = (cart as NewPlanCheckoutModel).couponCode;//: "FREETRIAL"DIWALI2020;
							 
                            console.log((cart as NewPlanCheckoutModel)); 
                            var userInfo = this.authService.getCurrentLoginUser();

                            
                            //if(((res.CardId == 102 || res.CardId == 161 || res.CardId == 162) && code == "FREETRIAL" && userInfo.isnew == false )   || (res.CardId == 162 && code == "BUY1GET1" && userInfo.isnew == false)  ) 
                            if(( code == "FREETRIAL" && userInfo.isnew == false ) || (res.CardId == 162 && code == "BUY1GET1" && userInfo.isnew == false)  ) 
                            /*if((code == "FREETRIAL" && userInfo.isnew == false )   || ( code == "BUY1GET1" && userInfo.isnew == false)  )*/
					 		{
								this.router.navigate(['/account/overview']);
								this.snackBarService.openWarning("This offer is available for New customers only. Kindly recharge your account or call customer service for assistance. Thank you!");
							}
							else
							{
								 if((res.CardId == 161 && code == "DIWALI2020"))
								 {
								 //serviceChargePercentage
									this.snackBarService.openWarning("We have already applied the coupon code.  Please go ahead and recharge your plan.");
								 }
								 else
								 {
									//this.snackBarService.openWarning("You have already purchased this plan before, continue to recharge it!");
								 }
							}
                            
							
                            
							
                            observer.next(model);
                            observer.complete();
                        } else {
                            if (!this.authService.isNewUser() && cart.transactiontype === TransactionType.Activation) {
                                cart = this.updateCartToSale(cart as NewPlanCheckoutModel)
                            }
                            observer.next(cart);
                            observer.complete();
                        }
                    });
            } else {
                observer.next(cart);
                observer.complete();
            }

        });
    }

    updateCartForRecharge(plan: Plan, cart: NewPlanCheckoutModel) {
        const model: RechargeCheckoutModel = new RechargeCheckoutModel();
        //console.log('cart is', cart);

        model.purchaseAmount = cart.details.Price
        model.couponCode = cart.couponCode;
        model.currencyCode = plan.CurrencyCode;
        model.cvv = '';
        model.planId = plan.PlanId
        model.transactiontype = TransactionType.Recharge;
        model.serviceChargePercentage = plan.ServiceChargePercent;
        model.planName = plan.CardName;
        model.countryFrom = plan.CountryFrom;
        model.countryTo = plan.CountryTo;
        model.cardId = plan.CardId;
        model.isAutoRefill = cart.isAutoRefill;
        model.isHideCouponEdit = cart.isHideCouponEdit;
		model.offerPercentage = (cart.offerPercentage)?cart.offerPercentage:'';
        this.checkoutService.setCurrentCart(model);
        return model;
    }

    updateCartToSale(cart: NewPlanCheckoutModel) {
        cart.transactiontype = TransactionType.Sale;
        this.checkoutService.setCurrentCart(cart);
        return cart;
    }

}