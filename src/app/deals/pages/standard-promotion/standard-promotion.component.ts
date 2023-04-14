import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Country } from '../../../core/models/country.model';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { DealsService } from '../../deals.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { Subscription, Observable } from 'rxjs';
import { NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Promotion } from '../../model/Promotion';
import { PromotionPlanDenomination } from '../../model/promotion-plan-denomination';
import { PromotionPlan } from '../../model/promotion-plan';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../../shared/utilities";
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { GlobalratesDialogComponent } from '../../../globalrates/globalrates-dialog/globalrates-dialog.component'; 
import { CountriesService } from '../../../core/services/country.service';
import { CallUsComponent } from '../../../shared/dialog/call-us/call-us.component';
import { NodataFoundComponent } from '../../../core/nodata-found/nodata-found.component';

import { PromotionsService } from '../../services/promotions.service';

@Component({
  selector: 'app-deal-view',
  templateUrl: './standard-promotion.component.html',
  styleUrls: ['./standard-promotion.component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class StandardPromotionComponent implements OnInit {
  autoControl = new FormControl();
  filteredCountry: Observable<Country[]>;
  allCountry: any[];
  listCountry:any[];
  countryToList: Observable<any[]>;
  selectedValue: string;
  promotionCode: string;
  countryTo: Country;
  inputCountryName:any;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  isDetailMode: boolean = false;
  isSmallScreen;
  promotion: Promotion;
  plan: PromotionPlan;
  planDenominations: PromotionPlanDenomination[];
  countryFrom: Country[];
    showPlaceholder: boolean = true;
  showDropdown: boolean = false;
  currentCurrency:any;
  searchicon: string = '../assets/images/search8.svg';
  contentLoaded: boolean;
   
  constructor(private router: Router,
    private route: ActivatedRoute,
    private dealsService: DealsService,
    private razaEnvService: RazaEnvironmentService,
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
	private razalayoutService: RazaLayoutService,
	private breakpointObserver: BreakpointObserver,
	private countryService: CountriesService,
   public dialog: MatDialog,
   private promotionsService:PromotionsService,
	) {

  }

  ngOnInit() {
    //this.razalayoutService.setFixedHeader(true);
    //this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
	
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });
    setTimeout(() => {
      this.contentLoaded = true;
    }, 2000);

    //this.dealsService.getCountryTo(this.promotion.PromotionCode, this.currentSetting.currentCountryId).subscribe(
      //(data: Country[]) => { this.countryToList = data; this.allCountry = data; }, (err: ApiErrorResponse) => console.log(err), );

		this.searchRatesGlobal();
		this.getCountryFrom();
		
     this.countryToList = this.autoControl.valueChanges
       .pipe(
         startWith<string | Country>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
         map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
       );

       this.promotionCode = this.promotion.PromotionCode;
      this.plan = this.promotion.Plans[0];
  }

  onSelectCountrFrom(country: Country) {
    this.listCountry=[];
    this.currentSetting.country = country;
    this.razaEnvService.setCurrentSetting(this.currentSetting);
    this.closeFlagDropDown();
    this.searchRatesGlobal();
    this.getPromotionSrvCall();
  }


  getPromotionSrvCall()
  {
   this.promotionsService.getPromotion(this.currentSetting.currentCountryId, this.promotionCode).subscribe(
   (data: any) => {
     var subpans = data
        if ( data && typeof data !== undefined ) 
       {
         this.promotion = data;
         this.plan = data.Plans[0];
         this.promotionCode = this.promotion.PromotionCode;
         //this.allCountry = data.Plans[0].Denominations;
       }
   
   }
   , (err: ApiErrorResponse) => console.log(err));
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

  getcountryrate(obj)
  {
    var price = obj;
    if(this.currentSetting.country.CountryId == 3)
    {
      price = price/2;
    }
    return price;
  }

public getRate (){
 
}

	private searchRatesGlobal() {
		 
		
	this.dealsService.getCountryTo(this.promotion.PromotionCode, this.currentSetting.currentCountryId).subscribe(
      (data: Country[]) => {
        this.setcurrentCurrency();
         this.allCountry = data;
         this.listCountry= data;
         if(data.length >0)
         {

         }else{
          
          this.dialog.open(NodataFoundComponent, {
            data:{
              msg:'No Data Found' },
             
            width: '85vw',
            maxWidth: '1235px'
          });
         }
       
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }
  
  
  toggleDetailMode() {
    window.scrollTo({ top: 5 });
    this.isDetailMode = !this.isDetailMode;
  }

  displayFn(country?: Country): string | undefined {
    return country ? country.CountryName : undefined;
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }
  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      //this.countryFrom = res;
      console.log(res)
      this.countryFrom = res.filter(({ CountryId }) => CountryId !== 3);
    });
  }
  get LandingPageBanner() {
    
    return `url('assets/images/existingcustomers-d.jpg') no-repeat cover`;
  }

  getBackGroundMap() {
    const name = this.countryTo.CountryName.replace(' ', '').toLowerCase();
    return `assets/images/maps/${name}-d.png`;
  }

  get freeMinTextCss() {
    return `text-${this.countryTo.CountryId}`;
  }
  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }
  
 plandenomination(country: any )
 {
   
    this.countryTo = country;
    var denomination = this.getDenominationByCountry(country.CountryId);
    var amount =  denomination[2].RatePerMin;
    if(this.currentSetting.country.CountryId == 3)
      {
        //amount = amount/2;
      }
      return amount;
  }

  countryChange(country: any , event: any) {
   if (event.isUserInput) { 
    this.countryTo = country;
	console.log(country.CountryId);
    this.planDenominations = this.getDenominationByCountry(country.CountryId);
	this.openDialog(country);
	}
	 
  }
   showDialog(country: any)
   {
    this.openDialog(country);
   }
   openDialog(obj){ 
     
	  var obj1 = this.getDenominationByCountry(obj.CountryId);
          this.dialog.open(GlobalratesDialogComponent, {
            data:{
              list:obj1, 
               
              country:obj, 
              flag_data:this.currentSetting.country, 
              courent_setting : this.currentSetting,
              trans_type:TransactionType.Activation,
              plan:this.plan},
             
            width: '85vw',
            maxWidth: '1235px'
          });
        
		}
  getDenominationByCountry(countryId: number): PromotionPlanDenomination[] {
    return this.plan.Denominations.filter(a => a.CountryToId === countryId);
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
    model.countryTo = this.countryTo.CountryId;
    model.currencyCode = item.CurrencyCode
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

  onClickInput() {
    this.searchicon = '../assets/images/search8.svg';
  }


onClickClose(icon) {
    if (icon == '../assets/images/cross8.png') {
      this.searchicon = '../assets/images/search8.svg';
    }
    this.showDropdown = false;
  }
   
    onInputFocus() {
    this.searchicon = '../assets/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;
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
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }
  
  contactUs() {
    this.dialog.open(CallUsComponent);
  }
}
