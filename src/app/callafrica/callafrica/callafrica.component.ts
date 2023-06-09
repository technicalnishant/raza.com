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
  selector: 'app-callafrica',
  templateUrl: './callafrica.component.html',
  styleUrls: ['./callafrica.component.scss'],
})
export class CallafricaComponent implements OnInit {
  headerValue: number = 1;
  showmore: number = 0;
  mode = new FormControl('over');
  dealCallAfrica: DealRate[] = [];
  dealless: DealRate[] = [];
  dealmore: DealRate[] = [];
  allCountriesData: DealRate[] = [];
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
   
  id: any = 1;
  currentClickedChar: string = "A";


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
  var price = obj;
  if(this.currentSetting.country.CountryId == 3)
  {
    //price = price/2;
  }
  return price;
}

  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }

  private getCountryRateOfAfrica() {

    this.dealsService.getCountryCallAfrica(this.currentSetting.currentCountryId).subscribe((data: any) => {
      if(data && data.length > 0)
      {
        this.allCountriesData = data;
        this.allCountry = data;
        this.allCountryList = data.splice(0, 5);
        
      }
      
      else{
        this.allCountriesData = [];
      this.allCountry = [];
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
    console.log(country);
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

  buyPlan(plan: DealRate) {
    this.OpenPlanDialog(plan.CountryId);
  }
   displayCountryList(character) {
    this.currentClickedChar = character;
    const filterValue = character.toLowerCase();
    this.bindSearchRates = this.searchRateslist.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }
 
  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }
 contactUs() 
  {
    this.dialog.open(CallUsComponent);
 
  }
}
