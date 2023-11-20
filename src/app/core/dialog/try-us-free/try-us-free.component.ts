import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
 
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
 
  
// import { Observable } from 'rxjs/internal/Observable';
import { from, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
 
import { tap } from 'rxjs/operators';

import { FreeTrial } from '../../../shared/model/freetrial';
import { FreeTrialService } from '../../../freetrial/freetrial.service';
import { CallUsComponent } from '../../../shared/dialog/call-us/call-us.component';
import { ApiErrorResponse } from '../../models/ApiErrorResponse';
import { AuthenticationService } from '../../services/auth.service';
import { NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { Denominations } from '../../../globalrates/model/denominations';
import { CurrentSetting } from '../../models/current-setting';
import { Subscription } from 'rxjs';
import { RazaEnvironmentService } from '../../services/razaEnvironment.service';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { DealsService } from '../../../deals/deals.service';
import { CountriesService } from '../../services/country.service';
import { SearchRatesService } from '../../../rates/searchrates.service';
import { GlobalRatesService } from '../../../home/globalrates.service';
 import { DealRate } from '../../../deals/model/dealRate';
import { GlobalCallComponent } from '../../../globalrates/global-call/global-call.component';
import { FreetrialDialogComponent } from '../../../globalrates/freetrial-dialog/freetrial-dialog.component';
 

import { Country } from '../../../shared/model/country';

import { SearchRate } from '../../../rates/model/searchRates';
import { PopularRate } from '../../../shared/model/popularRate';
import { NodataFoundComponent } from '../../nodata-found/nodata-found.component'; 
import { MetaTagsService } from 'app/core/services/meta.service';
import { LoginpopupComponent } from '../../loginpopup/loginpopup.component';
import { SignuppopupComponent } from 'app/core/signuppopup/signuppopup.component';
export interface State {
  flag: string;
  name: string;
  mobilerate: string;
  landline: string;
}
 
@Component({
  selector: 'app-try-us-free',
  templateUrl: './try-us-free.component.html',
  styleUrls: ['./try-us-free.component.scss']
})
export class TryUsFreeComponent implements OnInit {
  
  

 
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
  currentClickedChar: string = "All";
  alphabets:any=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  disabledList:any =[];
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
    public dialog: MatDialog, private metaTagsService:MetaTagsService,
    public dialogRef: MatDialogRef<TryUsFreeComponent>,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      
  }

  ngOnInit() {
 
     
    this.metaTagsService.getMetaTagsData('freetrial');
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });

   
	
	this.searchRatesService.getSearchRates(this.currentSetting.currentCountryId).subscribe(
      (data: SearchRate[]) => {
        this.searchRates = data;
       // this.displayCountryList('A');
      },
      (err: ApiErrorResponse) => console.log(err),
    ); 
	
	this.searchRatesService.getPopularRates(this.currentSetting.currentCountryId).subscribe(
      (data: PopularRate[]) => {
        this.popularRates = data;
        
	 //this.displayCountryList('A');
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
       // data = data.sort((a,b)=>a.CountryName > b.CountryName)

        data.sort((a, b) => {
          const nameA = a.CountryName.toUpperCase(); // ignore upper and lowercase
          const nameB = b.CountryName.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        
          // names must be equal
          return 0;
        });

        this.freeTrial = data;
        this.allCountry = data;
       // this.allCountryList = data.splice(0, 5);
        this.allCountryList = data;
        this.bindSearchRates = this.allCountryList;
        this.disablePagination(data);
      }
      else
      {
        this.freeTrial = [];
        this.allCountry = []
        this.allCountryList = [];
       // this.displayCountryList("A");
       this.bindSearchRates = this.allCountryList;
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
     // this.openModal();
    }
  }
 


  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      name: "logout",
      title: "Are you sure you want to logout?",
      description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      actionButtonText: "Logout",
      redirect: "free-trial",
    }
    localStorage.setItem('redirect_path', 'checkout/payment-info');
    
    const modalDialog = this.dialog.open(SignuppopupComponent, dialogConfig);
    this.closeIcon();
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
  filterList(obj, char)
  {
   
    const filterValue = char.toLowerCase();
    let filterlistdata =  obj.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
    return filterlistdata.length;
 
  }
  isDisabled(  char)
  {
   
    const filterValue = char.toLowerCase();
    if(this.allCountry.length > 0)
    {
      let filterlistdata =  this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
      return filterlistdata.length>0?false:true;
    }
    
 
  }
  disablePagination(obj)
  {
     var j = 0;
    this.alphabets.map(char=>{
      
      let list = this.filterList(obj, char);
     
            if(parseFloat(list) ==  0 )
            {
            

              this.disabledList[j] = char;
              j++;
              
              
            }
      
    })

  }
    displayCountryList(character) {
     
     if(this.isDisabled(character) && character != 'All') 
     return false;

      this.currentClickedChar = character;
      const filterValue = character.toLowerCase();
      // this.bindSearchRates = this.searchRates.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
      if(character == 'All')
      this.bindSearchRates = this.allCountryList;
      else
      {
        this.bindSearchRates = this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
      }
       
     
    
  }
  
    viewRates(country) {
 
  this.tryUsFree(country)
	 this.closeIcon();
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
   

  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }
   
  closeIcon(): void {
    this.dialogRef.close();
  }
 
}
