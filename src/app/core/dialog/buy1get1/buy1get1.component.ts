import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
 
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { startWith, map } from 'rxjs/operators';
import { Promotion } from '../../../deals/model/Promotion';
import { CurrentSetting } from '../../../core/models/current-setting';
import { PromotionPlan } from '../../../deals/model/promotion-plan';
import { PromotionPlanDenomination } from '../../../deals/model/promotion-plan-denomination';
import { NewPlanCheckoutModel, RechargeCheckoutModel } from '../../../checkout/models/checkout-model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { AuthenticationService } from '../../../core/services/auth.service';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { Router } from '@angular/router';
 
import { CallUsComponent } from '../../../shared/dialog/call-us/call-us.component';

import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';

import { DealsService } from '../../../deals/deals.service';

import { SearchRatesService } from '../../../rates/searchrates.service';
import { GlobalRatesService } from '../../../home/globalrates.service';

import { DealRate } from '../../../deals/model/dealRate';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { GlobalBuyComponent } from '../../../globalrates/global-buy/global-buy.component';


import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CountriesService } from '../../../core/services/country.service';
import { Country } from '../../../shared/model/country';
import { PromotionsService } from '../../../deals/services/promotions.service';

import { NodataFoundComponent } from '../../../core/nodata-found/nodata-found.component';

import { PlanService } from '../../../accounts/services/planService';
import { ICheckoutModel } from '../../../checkout/models/checkout-model';
import { ValidateCouponCodeResponseModel , ValidateCouponCodeRequestModel} from 'app/payments/models/validate-couponcode-request.model';
import { TransactionService } from '../../../payments/services/transaction.service';
import { ErrorDialogComponent } from '../../../shared/dialog/error-dialog/error-dialog.component';
import { ErrorDialogModel } from '../../../shared/model/error-dialog.model';
import { MetaTagsService } from 'app/core/services/meta.service';
@Component({
  selector: 'app-buy1get1',
  templateUrl: './buy1get1.component.html',
  styleUrls: ['./buy1get1.component.scss']
})
export class Buy1get1Component implements OnInit {

  promotion: Promotion;
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;

  showmore: any;
  plan: PromotionPlan;
  promotionCode:string = 'buy1-get1';
  showDropdown: boolean = false;
  showPlaceholder: boolean = true;
  isSmallScreen;
  countryFrom: Country[];
  allCountriesData:any[];
  listCountry:any[];
  countryTo: Country;
  defaultChar:any='A';
  searchicon: string = '../assets/images/search8.svg';
  mode = new FormControl('over');
  stateCtrl = new FormControl();
  limitDenomination: PromotionPlanDenomination[];

  allDenomination: PromotionPlanDenomination[];

  filteredCountry: Observable<any[]>;
  serchdata: any; autoControl = new FormControl(); allCountry: any[];
  currentCurrency:any;
  contentLoaded: boolean;
  recordsPerPage: number = 7;
 currentPage: number = 1;
  constructor(
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
    private router: Router,
 
	  private razalayoutService: RazaLayoutService,
    private breakpointObserver: BreakpointObserver,
    private razaEnvService: RazaEnvironmentService,
    private countryService: CountriesService,
    private dealsService: DealsService,
    private searchRatesService: SearchRatesService,
    private globalRatesService: GlobalRatesService,
    private promotionsService:PromotionsService,
    private planService: PlanService,
    private transactionService: TransactionService,
     private metaTagsService:MetaTagsService,
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<Buy1get1Component>,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

 



  ngOnInit() {
       
      this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
        this.currentSetting = res;
  
      });
  
      this.getPromotionSrvCall();
      this.getCountryFrom();
  
      this.filteredCountry = this.autoControl.valueChanges
        .pipe(
          startWith<string | any>(''),
          map(value => typeof value === 'string' ? value : value.CountryToName),
          map(CountryToName => CountryToName ? this._filter(CountryToName) : this.allCountry)
        );
  
        setTimeout(() => {
          this.contentLoaded = true;
        }, 2000);
  
    }
  
  
  
    openErrorDialog(error: ErrorDialogModel): void {
      this.dialog.open(ErrorDialogComponent, {
        data: { error }
      });
    }
    validateCoupon(req: ValidateCouponCodeRequestModel): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
      return this.transactionService.validateCouponCode(req).toPromise();
    }
     //get plan(): PromotionPlan {    return this.promotion.Plans[0]  }
  
     multiDimensionalUnique(arr) {
      var uniques = [];
      var itemsFound = {};
      for(var i = 0, l = arr.length; i < l; i++) {
          var stringified = JSON.stringify(arr[i].CountryToName);
          if(itemsFound[stringified]) { continue; }
          uniques.push(arr[i]);
          itemsFound[stringified] = true;
      }
      return uniques;
  }
  
  private _filterDenomination(value: any): any[] {
    const filterValue = value.toLowerCase();
    var all_denominations = this.getUnique(this.allDenomination, 'CountryToName' )
    return all_denominations.filter(option => option.CountryToName.toLowerCase().indexOf(filterValue) === 0);
  }
  
  
  getUnique(arr, comp) {
  
    // store the comparison  values in array
  const unique =  arr.map(e => e[comp])
  
  // store the indexes of the unique objects
  .map((e, i, final) => final.indexOf(e) === i && i)
  
  // eliminate the false indexes & return unique objects
  .filter((e) => arr[e]).map(e => arr[e]);
  
  return unique;
  }
  
  
  setDenominations = () =>{
  
          //this.limitDenomination = data.Plans[0].Denominations.splice(0, 5);
   this.limitDenomination =  this._filterDenomination( this.defaultChar);
  this.currentPage = 1;
  }
  
  setChar = obj =>{
    this.defaultChar = obj;
    this.setDenominations();
  }
   getPromotionSrvCall()
   {
   // getPromotion(countryId, promotionCode)
   this.promotionsService.getPromotion(this.currentSetting.currentCountryId, this.promotionCode).subscribe(
    (data: any) => {
      var subpans = data
  
  
        if ( data && typeof data.Plans !== undefined )
        {
          this.promotion = data.Plans[0];
  
          this.allDenomination = data.Plans[0].Denominations;
          //this.limitDenomination = data.Plans[0].Denominations.splice(0, 5);
          this.setDenominations()
          this.allCountry = this.multiDimensionalUnique(data.Plans[0].Denominations);
        }
        else{
  
          this.limitDenomination = [];
          this.allCountry = [];
  
          this.dialog.open(NodataFoundComponent, {
            data:{
              msg:'No Data Found' },
  
            width: '85vw',
            maxWidth: '1235px'
          });
        }
  
  
  
  
    }
    , (err: ApiErrorResponse) => console.log(err));
  }
    onSelectCountrFrom(country: Country) {
      this.currentSetting.country = country;
      this.razaEnvService.setCurrentSetting(this.currentSetting);
      this.closeFlagDropDown();
      this.getPromotionSrvCall();
      this.setcurrentCurrency()
    }
    setcurrentCurrency()
    {
      if(this.currentSetting.country.CountryId == 1)
        this.currentCurrency='USD';
        if(this.currentSetting.country.CountryId == 2)
        this.currentCurrency='CAD';
        if(this.currentSetting.country.CountryId == 3)
        this.currentCurrency='GBP';
        if(this.currentSetting.country.CountryId == 8)
        this.currentCurrency='AUD';
        if(this.currentSetting.country.CountryId == 20)
        this.currentCurrency='NZD';
        if(this.currentSetting.country.CountryId == 26)
        this.currentCurrency='INR';
    }
  
    private getCountryFrom() {
      this.countryService.getFromCountries().subscribe((res: Country[]) => {
  
        //this.countryFrom = res;
        this.countryFrom = res
        // this.countryFrom = res.filter(({ CountryId }) => CountryId !== 3);
      });
    }
  
    private _filter(value: any): any[] {
      const filterValue = value.toLowerCase();
      return this.allCountry.filter(option => option.CountryToName.toLowerCase().indexOf(filterValue) === 0);
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
  
      // return `url(assets/images/promotions/newyear/${this.promotion.LandingPageImage}) no-repeat center 100%`;
      return `url('assets/images/existingcustomers-d.jpg') no-repeat cover`;
  
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
  
  /*
      const model: RechargeCheckoutModel = new RechargeCheckoutModel();
  
      model.purchaseAmount = item.Price;
      model.couponCode = '';
      model.currencyCode = item.CurrencyCode;
      model.cvv = '';
      model.planId = this.plan.PromotionPlanId
      model.transactiontype = TransactionType.Recharge;
      model.serviceChargePercentage = this.plan.ServiceChargePercent;
      model.planName = this.plan.CardName;
      model.countryFrom = this.plan.CountryFrom;
      model.countryTo = this.plan.CountryTo;
      model.cardId = this.plan.CardId;
      model.isAutoRefill = this.isAutoRefillEnable;
    model.offerPercentage = '';
      this.checkoutService.setCurrentCart(model);
  */
    }
  
    openContactUsDialog() {
      const dialogRef1 = this.dialog.open(CallUsComponent,);
    }
  
    closeFlagDropDown() {
      this.showDropdown = false;
    }
    openFlagDropDown() {
  
      if (this.showDropdown) {
        this.showDropdown = false;
      } else {
        this.showDropdown = true;
      }
    }
  
  
  
    onClickPlaceholder() {
      this.showPlaceholder = true;
      document.getElementById("searchInput").focus();
    }
     onClickInput() {
      this.searchicon = '../assets/images/search8.svg';
    }
    onInputFocus() {
      this.searchicon = '../assets/images/cross8.png';
      this.showDropdown = false;
      this.showPlaceholder = false;
    }
  
    displayFn(country?: any): string | undefined {
      return country ? country.CountryName : undefined;
    }
  
    onClickClose(icon) {
      if (icon == '../assets/images/cross8.png') {
        this.searchicon = '../assets/images/search8.svg';
      }
      this.showDropdown = false;
    }
  
    showPopup(countryId, obj:any[])
    {
      this.OpenPlanDialog(countryId, obj);
    }
    OpenPlanDialog(countryId, obj:any[]) {
      this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
        (data: any) => {
          if (this.dialog.openDialogs.length == 0) {
            console.log(data);
            this.dialog.open(GlobalBuyComponent, {
              data: { data , custom:obj } ,
              width: '83vw',
              maxWidth: '1235px',
              panelClass: 'buy1get1popup-dialog'
            });
          }
        },
        (err: ApiErrorResponse) => console.log(err),
      );
    }
  
    viewRates(event, countryId, obj:any[]  ) {
      if (event.isUserInput) {
        this.OpenPlanDialog(countryId, obj);
      }
    }
  
  
    getImageName(name:any)
    {
      return name.replace(/\s+/g, '');
    }
    plandenomination(country: any )
    {
  
       this.countryTo = country;
       var denomination = this.getDenominationByCountry(country.CountryId);
       var price = 0;
       if(denomination[0])
       {
        price = denomination[0].RatePerMin;
       }
      return  price;
       console.log(denomination);
  
  
    }
    getDenominationByCountry(countryId: number): PromotionPlanDenomination[] {
      return this.plan.Denominations.filter(a => a.CountryToId === countryId);
    }

    closeIcon(): void {
      this.dialogRef.close();
    }

    
  get displayedRecords(): any[] {
    if(this.limitDenomination && this.limitDenomination[0])
    {
      const startIndex = (this.currentPage - 1) * this.recordsPerPage;
      const endIndex = startIndex + this.recordsPerPage;
      return this.limitDenomination.slice(startIndex, endIndex);
    }
   
  }
 // Function to handle page change
 onPageChange(pageNumber: number) {
  this.currentPage = pageNumber;
}
get totalPages2(): number[] {
  if(this.limitDenomination && this.limitDenomination[0])
    {
       return Array(Math.ceil(this.limitDenomination.length / this.recordsPerPage)).fill(0).map((x, i) => i + 1);
    }
}


get totalPages(): number[] {
  if(this.limitDenomination && this.limitDenomination[0])
  {
  const delta = 4; // Number of pages to display before and after the selected page
  const left = Math.max(1, this.currentPage - delta);
  const right = Math.min(this.limitDenomination.length, this.currentPage + delta);

  const range = [];
  for (let i = left; i <= right; i++) {
    if(this.limitDenomination.length >= i*7  )
    range.push(i);
  }

 

  return range;
}
}


getSelected(page)
{
  return (this.currentPage == page)?'selected':'';
}


// onClickAmountOption1(item: any) {
//   const model: RechargeCheckoutModel = new RechargeCheckoutModel();

//   model.purchaseAmount = item;
//   model.couponCode = 'Buy1Get1';
//   model.currencyCode = this.plan.CurrencyCode;
//   model.cvv = '';
//   model.planId = this.plan.PlanId
//   model.transactiontype = TransactionType.Recharge;
//   model.serviceChargePercentage = this.plan.ServiceChargePercent;
//   model.planName = this.plan.CardName;
//   model.countryFrom = this.plan.CountryFrom;
//   model.countryTo = this.plan.CountryTo;
//   model.cardId = this.plan.CardId;
//   model.isAutoRefill = false;
//   model.offerPercentage = '';
//   this.checkoutService.setCurrentCart(model);
//   this.router.navigate(['/checkout/payment-info']);
// }


// buyNow(obj:any, obj2:any, item) {
//   if(this.plan && this.plan.CardId)
//   {
//     this.onClickAmountOption1(obj);
//   }
//   else
//   {
//         var subcardid = '';
//         var cuponcode = 'BUY1GET1';
//         var service_fee = 0;
//         if(this.currentSetting.currentCountryId == 1)
//         {
//         subcardid = '161-'+obj2;
//         service_fee = 0;
//         }
//         if(this.currentSetting.currentCountryId== 2)
//         {
//         subcardid = '162-'+obj2;
//         service_fee = 10;
//         }
//           const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();
 
//           model.CardId = item.CardId;
//           model.CardName = item.CardName;
//           model.CurrencyCode = item.CurrencyCode;

//           model.details = {
//             Price: obj,
//             ServiceCharge: service_fee,
//           SubCardId:subcardid
//           }
//           model.country = null;
//           model.phoneNumber = null;
//           model.countryFrom = this.currentSetting.currentCountryId;
//           model.countryTo = this.countryId;
          
//           model.currencyCode = this.currentSetting.currency;
//           model.transactiontype = TransactionType.Activation;
//           model.isAutoRefill = false;
//           model.couponCode = cuponcode;
//           model.currencyCode = item.CurrencyCode;
//           model.isHideCouponEdit = true;
        
//         console.log(model);
        
//           this.checkoutService.setCurrentCart(model);

//           if (this.authService.isAuthenticated()) {
//             this.router.navigate(['/checkout/payment-info']);
//           } else {
//             this.router.navigate(['/checkout']);
//           }
        
//         this.dialogRef.close();
        
//         window.scroll({ 
//           top: 0, 
//           left: 0, 
//           behavior: 'smooth' 
//         });
//       }
// }

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
  
