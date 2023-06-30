import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { DealsService } from '../../deals/deals.service';
import { CountriesService } from '../../core/services/country.service';
import { SearchRatesService } from '../../rates/searchrates.service';
import { GlobalRatesService } from '../../home/globalrates.service';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';

import { DealRate } from '../../deals/model/dealRate';
import { CallUsComponent } from '../../shared/dialog/call-us/call-us.component';

import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { GlobalCallComponent } from '../../globalrates/global-call/global-call.component';
import { CurrentSetting } from '../../core/models/current-setting';
import { Country } from '../../shared/model/country';

import { SearchRate } from '../../rates/model/searchRates';
import { PopularRate } from '../../shared/model/popularRate';
import { NodataFoundComponent } from '../../core/nodata-found/nodata-found.component'; 
import { MetaTagsService } from 'app/core/services/meta.service';
import { AuthenticationService } from 'app/core/services/auth.service';
import { Router } from '@angular/router';

export interface State {
  flag: string;
  name: string;
  mobilerate: string;
  landline: string;
}

@Component({
  selector: 'app-callasia-new',
  templateUrl: './callasia-new.component.html',
  styleUrls: ['./callasia-new.component.scss']
})
export class CallasiaNewComponent implements OnInit {
  headerValue: number = 1;
  showmore: number = 0;
  dealCallAsia: DealRate[] = [];
  dealless: DealRate[] = [];
  dealmore: DealRate[] = [];
  allCountriesData: DealRate[] = [];
  allCountriesDataOld:any
  mode = new FormControl('over');
  stateCtrl = new FormControl();
  // defaultFlag: string = 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg';
  searchicon: string = '../assets/images/search8.svg';
  filteredStates: Observable<State[]>;
  filteredCountry: Observable<any[]>;
  showPlaceholder: boolean = true;
  showDropdown: boolean = false;
  selectedMap: string = 'flag flag-ad';
  serchdata: any; autoControl = new FormControl(); allCountry: any[]; allCountryList: any[];
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
    private titleService: Title,
    private dealsService: DealsService,
    private searchRatesService: SearchRatesService,
    private globalRatesService: GlobalRatesService,
    private razaEnvService: RazaEnvironmentService,
    private countryService: CountriesService,
    public dialog: MatDialog, 
    private metaTagsService:MetaTagsService,
    private authService: AuthenticationService,
    private router: Router
    ) {

  }

  ngOnInit() {
    this.titleService.setTitle('Call Asia');
    this.metaTagsService.getMetaTagsData('callasia');
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
      this.setcurrentCurrency();
    });

    this.filteredCountry = this.autoControl.valueChanges
      .pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
        map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      );

    

    this.searchRates();

    this.getCountryFrom();

  }

  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  openLoginPopup()
  {
    this.authService.loginPopup();
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
    this.dealsService.getCountryCallAsia(this.currentSetting.currentCountryId).subscribe((data: any) => {
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
  private searchRates() 
  { 
    let type = this.isUserAuthenticated() == true?'old':'new';
     this.dealsService.getCountryCallAsia1(this.currentSetting.currentCountryId, type).subscribe((data: any) => {
      if(data && data.length > 0)
      {
         this.allCountriesData = data;
        this.allCountry = data;
        this.allCountryList = data;//.splice(0,5);
         
        //this.bindSearchRates = data;
        this. getAsiaList();
      }
      else{
        //this.allCountriesData = [];
         
        this.allCountry = [];
        this.bindSearchRates = [];
        this.allCountryList = [];

        this.dialog.open(NodataFoundComponent, {
          data:{
            msg:'No Data Found' },
           
          width: '85vw',
          maxWidth: '1235px'
        });
        
      }
      
    }, (err: ApiErrorResponse) => console.log(err));

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

  showMoreCountry() {
    this.showmore = 1;
  }

  hideMoreCountry() {
    this.showmore = 0;
  }

   onClickInput() {
    this.searchicon = '../assets/images/search8.svg';
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  private openPlanDialog(countryId ) {
    

    if(this.currentSetting.currentCountryId == 3)
    {

      this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
        (data: any) => {
          if (this.dialog.openDialogs.length == 0) {
            this.dialog.open(GlobalCallComponent, {
              data: { data },
              width: '83vw',
              maxWidth: '1235px'
            });
          }
        },
        (err: ApiErrorResponse) => console.log(err),
      );

    }
    else{

      localStorage.setItem('rate_country_id', countryId);
      this.router.navigate(['globalcallrates']);
    }


  }

  viewRates(event, countryId) {
    if (event.isUserInput) {
      this.openPlanDialog(countryId);
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
    this.searchRates();
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

  onClickPlaceholder() {
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }

  getCountryFlag(countryId: number) {
    return `flag flag-${countryId}`;
  }

  buyPlan(plan: DealRate) {
    this.openPlanDialog(plan.CountryId);
  }
  
  // displayCountryList(character) {
  //   this.currentClickedChar = character;
  //   const filterValue = character.toLowerCase();
  //   this.bindSearchRates = this.searchRateslist.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  // }

 
  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }
    contactUs() {
    this.dialog.open(CallUsComponent);
 
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

}
