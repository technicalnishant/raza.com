import { Component, OnInit } from '@angular/core';
import { Promotion } from '../../model/Promotion';
import { CurrentSetting } from '../../../core/models/current-setting';
import { PromotionPlan } from '../../model/promotion-plan';
import { PromotionPlanDenomination } from '../../model/promotion-plan-denomination';
import { NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { AuthenticationService } from '../../../core/services/auth.service';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CallUsComponent } from '../../../shared/dialog/call-us/call-us.component';

@Component({
  selector: 'app-grid-view-promotion',
  templateUrl: './grid-view-promotion.component.html',
  styleUrls: ['./grid-view-promotion.component.css']
})
export class GridViewPromotionComponent implements OnInit {

  promotion: Promotion;
  currentSetting: CurrentSetting;
  showmore: any;
  plan: PromotionPlan;
  limitDenomination: PromotionPlanDenomination[];
  constructor(
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.plan = this.promotion.Plans[0];
    this.limitDenomination = this.plan.Denominations.slice(0, 6);
  }

  showMoreCountry() {
    this.limitDenomination = this.plan.Denominations;
    this.showmore = true
  }

  hideMoreCountry() {
    this.limitDenomination = this.plan.Denominations.slice(0, 6);
    this.showmore = false;
  }

  getCountryFlag(countryId: number) {
    return `flag flag-${countryId}`;
  }


  get LandingPageBanner() {
    return `url(assets/images/promotions/newyear/${this.promotion.LandingPageImage}) no-repeat center 100%`;
  }

  buyDeal(item: PromotionPlanDenomination) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.plan.CardId;
    model.CardName = this.plan.CardName;
    model.CurrencyCode = item.CurrencyCode;
    model.details = {
      Price: item.Price,
      ServiceCharge: this.plan.ServiceCharge ? this.plan.ServiceCharge : 0,
      SubCardId: item.SubCardId
    }
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = item.CountryToId;
    model.currencyCode = item.CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    model.isAutoRefill = false;
    model.couponCode = this.plan.CouponCode;
    model.isHideCouponEdit = !this.plan.IsEditCoupon;

    this.checkoutService.setCurrentCart(model);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  openContactUsDialog() {
    const dialogRef1 = this.dialog.open(CallUsComponent);
  }

}
