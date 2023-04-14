import { Component, OnInit } from '@angular/core';
import { CallUsComponent } from '../../../shared/dialog/call-us/call-us.component';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DealsService } from '../../deals.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { Subscription } from 'rxjs';
import { NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { Promotion } from '../../model/Promotion';
import { PromotionPlan } from '../../model/promotion-plan';


import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-india-unlimited',
  templateUrl: './india-unlimited.component.html',
  styleUrls: ['./india-unlimited.component.scss']
})
export class IndiaUnlimitedComponent implements OnInit {
  promotion: Promotion;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
	isSmallScreen;
  contentLoaded: boolean;

  constructor(private router: Router,
    private titleService: Title,
    public dialog: MatDialog,
    private razaEnvService: RazaEnvironmentService,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private dealService: DealsService,
	private razalayoutService: RazaLayoutService,
	private breakpointObserver: BreakpointObserver,
  ) {

  }

  ngOnInit() {
    //this.razalayoutService.setFixedHeader(true);
    //this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
	
    this.titleService.setTitle('India Unlimiteding');
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;

    });
    setTimeout(() => {
      this.contentLoaded = true;
    }, 2000);

  }

  get LandingPageBanner() {
    // return `url(assets/images/promotions/newyear/${this.promotion.LandingPageImage}) no-repeat center 100%`;
    return `url('assets/images/one-cent-plan.png') no-repeat cover`;
  }

  buyPlan(plan: PromotionPlan) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = plan.CardId;
    model.CardName = plan.CardName
    model.CurrencyCode = plan.Denominations[0].CurrencyCode;
    model.details = {
      Price: plan.Denominations[0].Price,
      ServiceCharge: plan.ServiceCharge ? plan.ServiceCharge : 0,
      SubCardId: plan.Denominations[0].SubCardId
    }
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = plan.Denominations[0].CountryToId;
    model.couponCode = '';
    model.currencyCode = plan.Denominations[0].CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    model.couponCode = plan.CouponCode;
    model.isCalculatedServiceFee = false;
    model.isAutoRefill = true;
    model.isMandatoryAutorefill = true;
    model.isHideCouponEdit = !plan.IsEditCoupon;

    this.checkoutService.setCurrentCart(model);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  callUs() {
    const dialogRef1 = this.dialog.open(CallUsComponent);
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

}
