import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef, } from '@angular/core';
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

@Component({
  selector: 'app-buy5popup',
  templateUrl: './buy5popup.component.html',
  styleUrls: ['./buy5popup.component.scss'],
})
export class Buy5popupComponent implements OnInit, OnDestroy {

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

  denominationList: any[];
  denominationSelectControl: FormControl = new FormControl();
  @ViewChild('matContent',{static: true}) matContent: ElementRef;

  constructor(
    private searchRatesService: GlobalRatesService,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<Buy5popupComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService
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
 


  buyNow(obj:any, obj2:any) {
  var subcardid = '';
  var cuponcode = 'BUY1GET1';
  if(this.currentSetting.currentCountryId == 1)
  {
	subcardid = '161-'+obj2;
  }
  if(this.currentSetting.currentCountryId== 2)
  {
	subcardid = '162-'+obj2;
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
      ServiceCharge: 10,
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
}

