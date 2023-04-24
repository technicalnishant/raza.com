
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { SearchRatesService } from '../searchrates.service';
import { SideBarService } from '../../core/sidemenu/sidemenu.service';
import { GlobalCallComponent } from '../../globalrates/global-call/global-call.component';
import { SearchRate } from '../model/searchRates';
import { Country } from '../model/country';
import { PopularRate } from '../../shared/model/popularRate';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { CurrentSetting } from '../../core/models/current-setting';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CountriesService } from '../../core/services/country.service';
import { MetaTagsService } from 'app/core/services/meta.service';
@Component({
  selector: 'app-searchrates',
  templateUrl: './searchrates.component.html',
  styleUrls: ['./searchrates.component.scss']
})
export class SearchratesComponent implements OnInit, OnDestroy {

  filteredCountry: Observable<Country[]>;
  globalPlansRate: any;
  searchRates: SearchRate[];
  bindSearchRates: SearchRate[];
  popularRates: PopularRate[];
  countryId: number;

  autoControl = new FormControl();
  allCountry: Country[];
  
  countryFrom: Country[]
  mode = new FormControl('over');
  headerValue: number = 1;
  id: any = 1;
  currentClickedChar: string = "A";

  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  showMore = false;
  showButton = true;

  showDropdown:boolean =false;
   currentCurrency:any;
  constructor(private router: Router,
    private titleService: Title,
    private searchRatesService: SearchRatesService,
    public dialog: MatDialog,
    private razaEnvService: RazaEnvironmentService,
    private sideBarService: SideBarService,
    private countryService: CountriesService, private metaTagsService:MetaTagsService) {
    this.sideBarService.toggle();

  }

  isVisibleFaq(){
    this.showMore = true;
    this.showButton = false;
   }
   
  ngOnInit() {
    this.titleService.setTitle('Search rates');
    this.metaTagsService.getMetaTagsData('searchrates');
 
    this.filteredCountry = this.autoControl.valueChanges
      .pipe(
        startWith<string | Country>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
        map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      );

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(
      res => {
        this.currentSetting = res;
        this.initAllRates();
      }, () => {
      });

      this.getCountryFrom();
  }

  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }

  ngOnDestroy(): void {
    this.currentSetting$.unsubscribe();
  }

  initAllRates() {
    this.searchRatesService.getAllCountries().subscribe(
      (data: Country[]) => {
        this.allCountry = data;
      },
      (err: ApiErrorResponse) => console.log(err),
    );

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
         
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  displayFn(country?: Country): string | undefined {
    return country ? country.CountryName : undefined;
  }

  displayCountryList(character) {
    this.currentClickedChar = character;
    const filterValue = character.toLowerCase();
    this.bindSearchRates = this.searchRates.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filter(value: any): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  addClass(id: any) {
    this.id = id;
  }

  viewRates(countryId) {
    localStorage.setItem('history_search_country_id', countryId);
     if(this.currentSetting.currentCountryId == 3)
      {
    this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
      (data: any) => {
        if (this.dialog.openDialogs.length == 0) {
          this.dialog.open(GlobalCallComponent, {
            data: { data },
            width: '85vw',
            maxWidth: '1235px'
          });
        }
      },
      (err: ApiErrorResponse) => console.log(err));
     }
    else
    {       
      localStorage.setItem('rate_country_id', countryId);
      this.router.navigate(['globalcallrates']); 
    } 
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
    this.setcurrentCurrency();
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

      this.initAllRates();
      //this.router.navigate(['./searchrates']);
  }
  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }


}