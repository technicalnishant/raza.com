import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { DealsService } from '../../deals/deals.service';
import { GlobalRatesService } from '../../home/globalrates.service';
import { SearchRatesService } from '../../rates/searchrates.service';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CountriesService } from '../../core/services/country.service';

import { GlobalCallComponent } from '../../globalrates/global-call/global-call.component';

import { DealRate } from '../../deals/model/dealRate';
import { CallUsComponent } from '../../shared/dialog/call-us/call-us.component';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { CurrentSetting } from '../../core/models/current-setting';
import { Country } from '../../core/models/country.model';

import { SearchRate } from '../../rates/model/searchRates'
import { PopularRate } from '../../shared/model/popularRate';
import { NodataFoundComponent } from '../../core/nodata-found/nodata-found.component'; 
import { MetaTagsService } from 'app/core/services/meta.service';
import { AuthenticationService } from 'app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callafrica-new',
  templateUrl: './callafrica-new.component.html',
  styleUrls: ['./callafrica-new.component.scss']
})
export class CallafricaNewComponent implements OnInit {
  headerValue: number = 1;
  showmore: number = 0;
  mode = new FormControl('over');
  dealCallAfrica: DealRate[] = [];
  dealless: DealRate[] = [];
  dealmore: DealRate[] = [];
  allCountriesData: DealRate[] = [];
  allCountriesDataOld:any;
  searchicon: string = '../assets/images/search8.svg';
  filteredCountry: Observable<any[]>;
  showPlaceholder: boolean = true;
  showDropdown: boolean = false;
  selectedMap: string = 'flag flag-ad';
  serchdata: any; autoControl = new FormControl(); allCountry: any[];allCountryList: any[];
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  countryFrom: Country[];
  currentCurrency:any;
  
   
  globalPlansRate: any;
  searchRateslist: SearchRate[];
  bindSearchRates: SearchRate[];
  popularRates: PopularRate[];
  allCountryFilteredList:any;
  id: any = 1;
  currentClickedChar: string = "All";
  

  constructor(
    private searchRatesService: SearchRatesService,
    private razaEnvService: RazaEnvironmentService,
    private dealsService: DealsService,
    private globalRatesService: GlobalRatesService,
    private countryService: CountriesService,
    public dialog: MatDialog, 
    private authService: AuthenticationService, 
    private metaTagsService:MetaTagsService,
    private router: Router
    ) {

  }

  ngOnInit() {
    this.metaTagsService.getMetaTagsData('callafrica');

    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
      this.setcurrentCurrency();
    });

    this.searchRates();
    this.getCountryRateOfAfrica();
    this.filteredCountry = this.autoControl.valueChanges
      .pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
        map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      );
    this.getCountryFrom();
  }
  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  openLoginPopup()
  {
    this.authService.loginPopup();
  }
  
  get filteredCountries(): DealRate[] {
    if (!this.showmore) {
      return this.allCountriesData.slice(0, 8);
    } else {
      return this.allCountriesData;
    }
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
  // var price = obj;
  //return price;
  // if(this.currentSetting.country.CountryId == 3)
  // {
    
  // }

 if( obj.CallingRateLandline > obj.CallingRateMobile)
  return obj.CallingRateMobile;
 else
  return obj.CallingRateLandline;


  
}

  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }
  filterCountries(asiaList, allCountries)
  {
    const mylist:any = allCountries.filter((country) =>
      asiaList.some((c) => c.CountryId === country.CountryId)
      );


      this.bindSearchRates = mylist
      this.allCountriesDataOld = mylist;
 
  }
  getAsiaList()
  {
    this.dealsService.getCountryCallAfrica(this.currentSetting.currentCountryId).subscribe((data: any) => {
      if(data && data.length > 0)
      {
        
         
        this.filterCountries(data, this.allCountry)
      }
      else{
        this.allCountriesDataOld = [];
        this.bindSearchRates = [];
      }
      
    }, (err: ApiErrorResponse) => console.log(err));
  }
  private getCountryRateOfAfrica() {

    let type = this.isUserAuthenticated() == true?'new':'old';
    
    this.dealsService.getCountryCallAfrica1(this.currentSetting.currentCountryId, type).subscribe((data: any) => {
      if(data && data.length > 0)
      {
        this.allCountriesData = data;
        this. getAsiaList();
        this.allCountry = data;
        this.allCountryList = data;//.splice(0, 5);
        this.allCountryFilteredList = this.allCountryList;
        this.allCountryFilteredList = this.allCountryList;
      //  this.bindSearchRates = this.allCountryList;
      }
      else
      {
        this.allCountriesData = [];
        this.allCountryFilteredList = [];
        this.allCountry = [];
        this.allCountryList = [];
        this.bindSearchRates = [];

        this.dialog.open(NodataFoundComponent, {
          data:{
            msg:'No Data Found' },
            width: '85vw',
            maxWidth: '1235px'
        });

      }
    }, (err: ApiErrorResponse) => console.log(err));
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }
   onClickInput() {
    this.searchicon = '../assets/images/search8.svg';
  }

  private searchRates() {
   //this.globalRatesService.getAllCountriesRates(this.currentSetting.currentCountryId).subscribe(
    //  (data: any) => {
     //   this.allCountry = data;
     // },
     // (err: ApiErrorResponse) => console.log(err),  )
  }

  // private OpenPlanDialog(countryId) {
  //   this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
  //     (data: any) => {
  //       if (this.dialog.openDialogs.length == 0) {
  //         this.dialog.open(GlobalCallComponent, {
  //           data: { data },
  //           width: '83vw',
  //           maxWidth: '1235px'
  //         });
  //       }
  //     },
  //     (err: ApiErrorResponse) => console.log(err),
  //   );
  // }



  private OpenPlanDialog(countryId) {

    // if(this.currentSetting.currentCountryId == 3)
    // {

    //   this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
    //     (data: any) => {
    //       if (this.dialog.openDialogs.length == 0) {
    //         this.dialog.open(GlobalCallComponent, {
    //           data: { data },
    //           width: '83vw',
    //           maxWidth: '1235px'
    //         });
    //       }
    //     },
    //     (err: ApiErrorResponse) => console.log(err),
    //   );

    // }
    // else{

    //   localStorage.setItem('rate_country_id', countryId);
    //   this.router.navigate(['globalcallrates']);
    // }
    
    localStorage.setItem('rate_country_id', countryId);
    this.router.navigate(['globalcallrates']);
  

  }


viewPopUp(countryId)
{
  this.OpenPlanDialog(countryId);
}
  viewRates(event, countryId) {
    if (event.isUserInput) {
      this.OpenPlanDialog(countryId);
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
    this.getCountryRateOfAfrica();
    this.closeFlagDropDown();
    this.setcurrentCurrency();
  }

  onInputFocus() {
    this.searchicon = '../assets/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;
  }


  onClickClose(icon) {
    if (icon == '../assets/images/cross8.png') {
      this.searchicon = '../assets/images/search8.svg';
    }
    this.showDropdown = false;
  }

  showMoreCountry() {
    this.showmore = 1;
  }

  hideMoreCountry() {
    this.showmore = 0;
  }

  onClickPlaceholder() {
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }

  getCountryFlag(countryId: number) {
    return `flag flag-${countryId}`;
  }

  buyPlan(plan: DealRate) 
  {
    this.OpenPlanDialog(plan.CountryId);
  }


  isDisabled(  char)
  {
   
    const filterValue = char.toLowerCase();
    if(this.allCountriesDataOld.length > 0)
    {
      let filterlistdata =  this.allCountriesDataOld.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
      return filterlistdata.length>0?false:true;
    }
  
  }

   displayCountryList(character) 
   {
   
    if(this.isDisabled(character) && character != 'All') 
     return false;

    this.currentClickedChar = character;
    if(this.currentClickedChar == 'All')
    {
    
      this.bindSearchRates = this.allCountriesDataOld;
    }
    else
    {
      
      const filterValue = character.toLowerCase();
      this.bindSearchRates = this.allCountriesDataOld.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
      
    }
    
  }
 
  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }
 contactUs() 
  {
    this.dialog.open(CallUsComponent);
 
  }


  /********************/
  filterList(obj, char)
  {
   
    const filterValue = char.toLowerCase();
    let filterlistdata =  obj.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
    return filterlistdata.length;
 
  }
 
  
}
