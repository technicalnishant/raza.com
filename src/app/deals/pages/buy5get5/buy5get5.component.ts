import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { startWith, map } from 'rxjs/operators';
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

import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';

import { DealsService } from '../../../deals/deals.service';
 
import { SearchRatesService } from '../../../rates/searchrates.service';
import { GlobalRatesService } from '../../../home/globalrates.service';
 
import { DealRate } from '../../../deals/model/dealRate';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Buy5popupComponent } from '../../../globalrates/buy5popup/buy5popup.component';
//import { GlobalBuyComponent } from '../../../globalrates/buy5popup/buy5popup.component';
 

import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CountriesService } from '../../../core/services/country.service';
import { Country } from '../../../shared/model/country';
import { PromotionsService } from '../../services/promotions.service';
 
import { NodataFoundComponent } from '../../../core/nodata-found/nodata-found.component';

@Component({
  selector: 'app-buy5get5',
  templateUrl: './buy5get5.component.html',
  styleUrls: ['./buy5get5.component.scss']
})
export class Buy5get5Component implements OnInit {

  promotion: Promotion;
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  
  showmore: any;
  plan: PromotionPlan;
  promotionCode:string;
  showDropdown: boolean = false;
  showPlaceholder: boolean = true;
  isSmallScreen;
  countryFrom: Country[];
  allCountriesData:any[];
  listCountry:any[];
  countryTo: Country;
  searchicon: string = '../assets/images/search8.svg';
  mode = new FormControl('over');
  stateCtrl = new FormControl();
  limitDenomination: PromotionPlanDenomination[];
  filteredCountry: Observable<any[]>;
  serchdata: any; autoControl = new FormControl(); allCountry: any[];
  currentCurrency:any;
  constructor(
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
    private router: Router,
    public dialog: MatDialog,
	private razalayoutService: RazaLayoutService,
  private breakpointObserver: BreakpointObserver,
  private razaEnvService: RazaEnvironmentService,
  private countryService: CountriesService,
  private dealsService: DealsService,
    private searchRatesService: SearchRatesService,
    private globalRatesService: GlobalRatesService,
    private promotionsService:PromotionsService,
    
  ) { }
   
  
      
	
     
   
  ngOnInit() {
  //this.razalayoutService.setFixedHeader(true);
    //this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
   // this.plan = this.promotion.Plans[0];
    //console.log(this.promotion);
    //this.promotionCode = this.promotion.PromotionCode;
	this.promotionCode = 'buy1-get1';
    //this.limitDenomination = this.plan.Denominations.slice(0, 5);
    //this.allCountry = this.plan.Denominations;
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

      
  
  }
  openLoginPopup()
   {
     this.authService.loginPopup();
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


 getPromotionSrvCall()
 {
 // getPromotion(countryId, promotionCode)
 this.promotionsService.getPromotion(this.currentSetting.currentCountryId, this.promotionCode).subscribe(
  (data: any) => {
    var subpans = data
      
      
      if ( data && typeof data.Plans !== undefined ) 
      {
        this.promotion = data.Plans[0];
         
        
        this.limitDenomination = data.Plans[0].Denominations.splice(0, 5);
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
      console.log(res)
      this.countryFrom = res.filter(({ CountryId }) => CountryId !== 3);
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
  }
  
  openContactUsDialog() {
    const dialogRef1 = this.dialog.open(CallUsComponent);
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
          this.dialog.open(Buy5popupComponent, {
            data: { data , custom:obj } ,
            width: '83vw',
            maxWidth: '1235px'
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
}

