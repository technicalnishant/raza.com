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
import { SearchRatesService } from '../../../rates/searchrates.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Denominations } from '../../../globalrates/model/denominations';
import { GlobalPlansData } from '../../../globalrates/model/globalPlansData';
@Component({
  selector: 'app-guyana',
  templateUrl: './guyana.component.html',
  styleUrls: ['./guyana.component.scss']
})
export class GuyanaComponent implements OnInit {

  promotion: Promotion;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
	isSmallScreen;
  contentLoaded: boolean;
  PlansR:Denominations[];
  Plans:Denominations[];
  cardId:number;
  cardName:string;
  currencyCode:number;
  globalPlanData: GlobalPlansData;
  countryId:number;
  guyana:string="guyana";
  constructor(private router: Router,
    private titleService: Title,
    public dialog: MatDialog,
    private razaEnvService: RazaEnvironmentService,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private dealService: DealsService,
	private razalayoutService: RazaLayoutService,
	private breakpointObserver: BreakpointObserver,
  private searchRatesService: SearchRatesService,
  ) {

  }

  ngOnInit() {
    //this.razalayoutService.setFixedHeader(true);
    //this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
    this.titleService.setTitle('Guyana special');
    this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, 123).subscribe(
      (data: any) => {
       
          this.globalPlanData = data;
          this.Plans = data.AutorefillPlans.Denominations;
         // this.PlansR = data.AutorefillPlans.Denominations;
          //this.Plans.reverse();
          /*this.Plans[0] = this.PlansR[3];
          this.Plans[1] = this.PlansR[2];
          this.Plans[2] = this.PlansR[1];*/

          this.Plans[0].Price = 10;
          this.Plans[1].Price = 20;
          this.Plans[2].Price = 50;
          
          this.Plans[0].SubCardId ="161-3";
          this.Plans[1].SubCardId = "161-4";
          this.Plans[2].SubCardId = "161-5";
/*
          this.Plans[0].TotalTime = 215;
          this.Plans[1].TotalTime = 430;
          this.Plans[2].TotalTime = 1075;
*/
          this.Plans[0].TotalTime = 110;
          this.Plans[1].TotalTime = 220;
          this.Plans[2].TotalTime = 550;

          this.cardId = data.CardId;
          this.cardName = data.CardName;
          this.countryId = data.CountryId;
          this.currencyCode = data.CurrencyCode;
      },
      (err: ApiErrorResponse) => console.log(err),
    );
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
      SubCardId: ''
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



  buyPlanNow(item: Denominations) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.globalPlanData.CardId;
    model.CardName = this.globalPlanData.CardName;
    model.CurrencyCode = this.globalPlanData.CurrencyCode;
    model.details = item;
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = this.countryId;
    model.couponCode = '';
    model.currencyCode = this.globalPlanData.CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    //     model.phoneNumber = ''; 
    //model.transactiontype = this.authService.isNewUser() ? TransactionType.Activation : TransactionType.Sale;
    model.isAutoRefill = false;
    this.checkoutService.setCurrentCart(model);
    
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/checkout/payment-info']);
      } else {
        this.router.navigate(['/checkout']);
      }
    
  }
 
  contactUs() {
    this.dialog.open(CallUsComponent);
  }
}
