import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
  
import { Observable } from 'rxjs/internal/Observable';
 
import { startWith, map } from 'rxjs/operators';
 


import { FreeTrial } from '../../shared/model/freetrial';
import { FreeTrialService } from '../freetrial.service';
import { CallUsComponent } from '../../shared/dialog/call-us/call-us.component';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { AuthenticationService } from '../../core/services/auth.service';
import { NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
import { Denominations } from '../../globalrates/model/denominations';
import { CurrentSetting } from '../../core/models/current-setting';
import { Subscription } from 'rxjs';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { TransactionType } from '../../payments/models/transaction-request.model';
import { CheckoutService } from '../../checkout/services/checkout.service';
import { DealsService } from '../../deals/deals.service';
import { CountriesService } from '../../core/services/country.service';
import { SearchRatesService } from '../../rates/searchrates.service';
import { GlobalRatesService } from '../../home/globalrates.service';
 import { DealRate } from '../../deals/model/dealRate';
import { GlobalCallComponent } from '../../globalrates/global-call/global-call.component';
import { FreetrialDialogComponent } from '../../globalrates/freetrial-dialog/freetrial-dialog.component';
 

import { Country } from '../../shared/model/country';

import { SearchRate } from '../../rates/model/searchRates';
import { PopularRate } from '../../shared/model/popularRate';
import { NodataFoundComponent } from '../../core/nodata-found/nodata-found.component'; 
import { MetaTagsService } from 'app/core/services/meta.service';

export interface State {
  flag: string;
  name: string;
  mobilerate: string;
  landline: string;
}

@Component({
  selector: 'app-freetrial',
  templateUrl: './freetrial.component.html',
  styleUrls: ['./freetrial.component.scss']
})
export class FreeTrialComponent implements OnInit, OnDestroy {

  freeTrial: FreeTrial[];
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  
  dealCallAsia: DealRate[] = [];
  dealless: DealRate[] = [];
  dealmore: DealRate[] = [];
  allCountriesData: DealRate[] = [];
  filteredStates: Observable<State[]>;
  

  filteredCountry: Observable<any[]>;
  showPlaceholder: boolean = true;
  showDropdown: boolean = false;
  showmore: number = 0;
  serchdata: any; autoControl = new FormControl(); allCountry: any[]; allCountryList: any[];
  countryFrom: Country[];
  globalPlansRate: any;
  searchRates: SearchRate[];
  searchRateslist: SearchRate[];
  bindSearchRates: SearchRate[];
  popularRates: PopularRate[];
  id: any = 1;
  currentClickedChar: string = "A";
 searchicon: string = '../assets/images/search8.svg';
  

  constructor(private router: Router,
    private titleService: Title,
    private freeTrialService: FreeTrialService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService,
    private checkoutService: CheckoutService,
	
	 private dealsService: DealsService,
    private searchRatesService: SearchRatesService,
    private globalRatesService: GlobalRatesService,
   
    private countryService: CountriesService,
	
    private auth: AuthenticationService,
    public dialog: MatDialog, private metaTagsService:MetaTagsService) {
  }

  ngOnInit() {
 
     
    this.metaTagsService.getMetaTagsData('freetrial');
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });

   
	
	this.searchRatesService.getSearchRates(this.currentSetting.currentCountryId).subscribe(
      (data: SearchRate[]) => {
        this.searchRates = data;
        this.displayCountryList('A');
      },
      (err: ApiErrorResponse) => console.log(err),
    ); 
	
	this.searchRatesService.getPopularRates(this.currentSetting.currentCountryId).subscribe(
      (data: PopularRate[]) => {
        this.popularRates = data;
        
	 this.displayCountryList('A');
      },
      (err: ApiErrorResponse) => console.log(err),
    );
	
	
	this.searchRatesGlobal();
  this.getCountryFrom();
  this.searchRatesList();
   
    
    this.filteredCountry = this.autoControl.valueChanges
      .pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
        map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      );
   
  }

  openLoginPopup()
  {
    this.auth.loginPopup();
  }
  
 private searchRatesList()
 {
  this.freeTrialService.getFreeTrial(this.currentSetting.currentCountryId).subscribe(
    (data: FreeTrial[]) => {
      if(data && data.length >0)
      {
        this.freeTrial = data;
        this.allCountry = data;
        this.allCountryList = data.splice(0, 5);
      }
      else
      {
        this.freeTrial = [];
        this.allCountry = []
        this.allCountryList = [];
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
 private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }
 private openPlanDialog(countryId: number) 
 {
    this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
      (data: any) => {
        if (this.dialog.openDialogs.length == 0) {
          //this.dialog.open(GlobalCallComponent, {
          this.dialog.open(FreetrialDialogComponent, {
            data: { data },
            width: '83vw',
            maxWidth: '1235px'
          });
        }
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }
  
  private searchRatesGlobal() {
    this.globalRatesService.getAllCountriesRates(this.currentSetting.currentCountryId).subscribe(
      (data: any) => {
        //this.allCountry = data;
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  get filteredCountries(): DealRate[] {
    if (!this.showmore) {
      return this.allCountriesData.slice(0, 8);
    } else {
      return this.allCountriesData;
    }
  }


  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }  
  ngOnDestroy(): void {
    this.currenctSetting$.unsubscribe();
  }

  getCountryFlag(countryId: number) {
    return `flag flag-${countryId}`;
  }

  callUs() {
    const dialogRef1 = this.dialog.open(CallUsComponent);
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

  tryUsFree(freeTrialPlan: FreeTrial) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = freeTrialPlan.CardId;
    model.CardName = freeTrialPlan.CardName;
    model.CurrencyCode = freeTrialPlan.CurrencyCode;
    model.details = {
      Price: 0,
      ServiceCharge: 0,
    }
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = freeTrialPlan.CountryTo;
    model.couponCode = '';
    model.currencyCode = this.currentSetting.currency;
    model.transactiontype = TransactionType.Activation;
    model.isAutoRefill = false;
    model.couponCode = freeTrialPlan.CouponCode;
    model.isHideCouponEdit = true;
    this.checkoutService.setCurrentCart(model);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }
 

  displayFn(country?: any): string | undefined {
    return country ? country.CountryName : undefined;
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

  onSelectCountrFrom(country: Country) {
    this.currentSetting.country = country;
    this.razaEnvService.setCurrentSetting(this.currentSetting);
    this.closeFlagDropDown();
    this.searchRatesList();
  }

  onInputFocus() {
    this.searchicon = '../assets/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;
  }
  
  
    displayCountryList(character) {
    this.currentClickedChar = character;
    const filterValue = character.toLowerCase();
    //this.bindSearchRates = this.searchRates.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }
  
    viewRates(country) {
	//console.log(country);
	if (this.dialog.openDialogs.length == 0) {
          this.dialog.open(FreetrialDialogComponent, {
            data: { country: country},
            width: '85vw',
            maxWidth: '600px'
          });
        }
		
    //this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
     // (data: any) => { (err: ApiErrorResponse) => console.log(err));
  }
  
    onClickClose(icon) {
    if (icon == '../assets/images/cross8.png') {
      this.searchicon = '../assets/images/search8.svg';
    }
    this.showDropdown = false;
  }
   onClickPlaceholder() {
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }
  
       onClickInput() {
    this.searchicon = '../assets/images/search8.svg';
  }
    contactUs() {
    this.dialog.open(CallUsComponent);
  }


  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }
  


}
