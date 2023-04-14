import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef,ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalRatesService } from '../globalrates.service';
import { CallUsComponent } from '../../shared/dialog/call-us/call-us.component';
import { GlobalSubPlans } from '../model/globalSubPlans';
import { RefillPlans } from '../model/refillPlans';
import { Router } from '@angular/router';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { Denominations } from '../model/denominations';
import { GlobalPlansData } from '../model/globalPlansData';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { of, Subscription } from 'rxjs';
import { CheckoutService } from '../../checkout/services/checkout.service';
import { NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
import { TransactionType } from '../../payments/models/transaction-request.model';
import { AuthenticationService } from '../../core/services/auth.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { CurrencyCode } from '../../core/interfaces/CurrencyCode';
import { FormControl } from '@angular/forms';

import { Plan } from '../../accounts/models/plan';
import { PlanService } from '../../accounts/services/planService';
import { RechargeCheckoutModel, ICheckoutModel } from '../../checkout/models/checkout-model';
import { ValidateCouponCodeResponseModel , ValidateCouponCodeRequestModel} from 'app/payments/models/validate-couponcode-request.model';
import { TransactionService } from '../../payments/services/transaction.service'; 
@Component({
  selector: 'app-global-buy',
  templateUrl: './global-buy.component.html',
  styleUrls: ['./global-buy.component.scss'],
})
export class GlobalBuyComponent implements OnInit, OnDestroy {

  countryCode: number;
  countryName: string;
  countryId: number;
  currencyCode: CurrencyCode;
  RatePerMin: number;
  RatePerMinPromo: number;
  RatePerMinWithOutPromo: number;
  SubPlans: GlobalSubPlans[] = [];
  FilteredSubPlans: GlobalSubPlans[] = [];
  Plans: Denominations[];
  AutorefillPlans: Denominations[];
  WithoutAutorefillPlans: Denominations[];
  isAutorefill = true;
  viewAllrate = false;
  viewAllPlan = false;
 

  globalPlanData: GlobalPlansData;
  customdata : any[];
  customCountry:any;
  customCountryId:any;
  customCountryPrice:any;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;

  CountryToId:any;
      CountryToName:any;
      CurrencyCode:any;
      FreeMin:any;
      IsPercentageAmountOffer:any;
      OfferPercentage:any;
      Price:any;
       
      RegularMin:any;
      ServiceCharge:any;
      SubCardId:any;
      firstBox:any[];
      secondBox:any[];
      thirdBox:any[];
      oneFreemin:number;
      plan: Plan;
  denominationList: any[];
  denominationSelectControl: FormControl = new FormControl();
  @ViewChild('matContent',{static: true}) matContent: ElementRef;

  constructor(
    private searchRatesService: GlobalRatesService,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<GlobalBuyComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService,
    private planService: PlanService,
    private transactionService: TransactionService,
  ) {
    this.countryCode = inputData.data.CountryCode;
    this.countryId = inputData.data.CountryId;
    this.countryName = inputData.data.CountryName;
    this.Plans = inputData.data.AutorefillPlans.Denominations;
    this.AutorefillPlans = inputData.data.AutorefillPlans.Denominations;
    this.RatePerMinPromo = inputData.data.AutorefillPlans.RatePerMin;
    this.RatePerMin = this.RatePerMinPromo;
    this.RatePerMinWithOutPromo = inputData.data.WithoutAutorefillPlans.RatePerMin;
    this.WithoutAutorefillPlans = inputData.data.WithoutAutorefillPlans.Denominations;
    this.globalPlanData = inputData.data;
    this.customdata = inputData.custom;

    
    this.customCountry = inputData.custom.CountryToName;
    this.customCountryId = inputData.custom.CountryToId;
    this.customCountryPrice = inputData.custom.customCountryPrice;
    this.CountryToId = inputData.custom.CountryToId;
    this.CountryToName = inputData.custom.CountryToName;
    this.CurrencyCode = inputData.custom.CurrencyCode;
    this.FreeMin = inputData.custom.FreeMin;
    this.IsPercentageAmountOffer = inputData.custom.IsPercentageAmountOffer;
    this.OfferPercentage = inputData.custom.OfferPercentage;
    this.Price = inputData.custom.Price;
    this.RatePerMin = inputData.custom.RatePerMin;
    this.RegularMin = inputData.custom.RegularMin;
    this.ServiceCharge = inputData.custom.ServiceCharge;
    this.SubCardId = inputData.custom.SubCardId;
    this.oneFreemin = this.FreeMin/this.Price;

     console.log(inputData.data);
     console.log(inputData.custom);
      

  }

  ngOnInit() {
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
      
    });
    if (this.authService.isAuthenticated()) {
     //this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe( 
      this.planService.getStoredPlan(localStorage.getItem("login_no")).subscribe( 
      
      (res:any)=>{
        
        this.plan = res;
       /* if(res.CardId && res.CardId !== 'undefined')
        {
            var obj =  {
              CouponCode: 'Buy1Get1',
              CardId: this.plan.CardId,
              CountryFrom: this.plan.CountryFrom,
              CountryTo: this.plan.CountryTo,
              Price: 3,
              TransType: TransactionType.Recharge
          }
  
          this.validateCoupon(obj).then((res: ValidateCouponCodeResponseModel) => {
            if (res.Status) 
            {
  
            }
            else{
              alert("This offer is available for New customers only. Kindly recharge your account or call customer service for assistance. Thank you!");
            }
          
          })
        }*/
       
      }
    );
    }

  }

  ngOnDestroy(): void {
    this.currenctSetting$.unsubscribe();
  }

  contactUs() {
    this.dialog.open(CallUsComponent);
  }

  onChange(event) {
    if (event.checked == true) {
      this.Plans = this.AutorefillPlans;
      this.isAutorefill = true;
      this.RatePerMin = this.RatePerMinPromo;
    }
    else {
      this.Plans = this.WithoutAutorefillPlans;
      this.isAutorefill = false;
      this.RatePerMin = this.RatePerMinWithOutPromo;
    }
  }

  selectAmount(arg) {

  }

  selectDenomination() {
    this.filterDetailRate(this.denominationSelectControl.value);
  }


  filterDetailRate(price: number) {
    this.FilteredSubPlans = this.SubPlans.filter(a => a.Price == price);
  }


  closeIcon(): void {
    this.dialogRef.close();
  }

  learnmore() {
    this.dialogRef.close();
    localStorage.setItem('countryId', this.countryId.toString());
    this.router.navigateByUrl(`/learnmore?country=${this.countryId}`);
  }

  viewAllRatesTab() {
    this.searchRatesService.getSearchGlobalRatesSubPlans(this.currentSetting.currentCountryId, this.countryId).subscribe(
      (data: any) => {
        this.SubPlans = data
        if (this.SubPlans.length > 0) {
          this.denominationList = Array.from(new Set(this.SubPlans.map(item => item.Price)));
          this.denominationSelectControl.setValue(this.denominationList[0]);
          this.filterDetailRate(this.denominationList[0]);
          this.viewAllrate = true;
          this.matContent.nativeElement.scrollTop = 500;
        }
        else
          this.viewAllPlan = false;
      }
      , (err: ApiErrorResponse) => console.log(err));
  }
 
   
  validateCoupon(req: ValidateCouponCodeRequestModel): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
    return this.transactionService.validateCouponCode(req).toPromise();
  }
  onClickAmountOption1(item: any) {
    const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    model.purchaseAmount = item;
    model.couponCode = 'Buy1Get1';
    model.currencyCode = this.plan.CurrencyCode;
    model.cvv = '';
    model.planId = this.plan.PlanId
    model.transactiontype = TransactionType.Recharge;
    model.serviceChargePercentage = this.plan.ServiceChargePercent;
    model.planName = this.plan.CardName;
    model.countryFrom = this.plan.CountryFrom;
    model.countryTo = this.plan.CountryTo;
    model.cardId = this.plan.CardId;
    model.isAutoRefill = false;
    model.offerPercentage = '';
    this.checkoutService.setCurrentCart(model);
    this.router.navigate(['/checkout/payment-info']);
  }


  buyNow(obj:any, obj2:any) {
    if(this.plan && this.plan.CardId)
    {
      this.onClickAmountOption1(obj);
    }
    else
    {
          var subcardid = '';
          var cuponcode = 'BUY1GET1';
          var service_fee = 0;
          if(this.currentSetting.currentCountryId == 1)
          {
          subcardid = '161-'+obj2;
          service_fee = 0;
          }
          if(this.currentSetting.currentCountryId== 2)
          {
          subcardid = '162-'+obj2;
          service_fee = 10;
          }
            const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

            //model.CardId = this.cardId;
          // model.CardName = this.cardName;
            //model.CurrencyCode = this.currencyCode;
            model.CardId = this.globalPlanData.CardId;
            model.CardName = this.globalPlanData.CardName;
            model.CurrencyCode = this.globalPlanData.CurrencyCode;

            model.details = {
              Price: obj,
              ServiceCharge: service_fee,
            SubCardId:subcardid
            }
            model.country = null;
            model.phoneNumber = null;
            model.countryFrom = this.currentSetting.currentCountryId;
            model.countryTo = this.countryId;
            
            model.currencyCode = this.currentSetting.currency;
            model.transactiontype = TransactionType.Activation;
            model.isAutoRefill = false;
            model.couponCode = cuponcode;
            model.currencyCode = this.globalPlanData.CurrencyCode;
            model.isHideCouponEdit = true;
          
          console.log(model);
          
            this.checkoutService.setCurrentCart(model);

            if (this.authService.isAuthenticated()) {
              this.router.navigate(['/checkout/payment-info']);
            } else {
              this.router.navigate(['/checkout']);
            }
          
          this.dialogRef.close();
          
          window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
          });
        }
  }


  //GlobalPlansData
  onClickRateTab(item: Denominations) {
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
    model.transactiontype = this.authService.isNewUser() ? TransactionType.Activation : TransactionType.Sale;
    model.isAutoRefill = this.isAutorefill;
    this.checkoutService.setCurrentCart(model);
    of(this.closeIcon()).toPromise().then(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/checkout/payment-info']);
      } else {
        this.router.navigate(['/checkout']);
      }
    })
  }

  buyPlan() {
    const deno: Denominations = this.Plans.find(a => a.Price == this.denominationSelectControl.value);
    this.onClickRateTab(deno);
  }

  scrollToTop() {
    this.matContent.nativeElement.scrollTop = 0;
  }


  currSymbol = ()=>
  {
    if(this.currentSetting.country.CountryId == 1 || this.currentSetting.country.CountryId == 2)
    {
      return "$"; 
    }
    else{
      return  "£"
    }
    

  }
}
