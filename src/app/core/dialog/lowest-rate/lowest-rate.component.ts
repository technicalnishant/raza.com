
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SearchRatesService } from '../../../rates/searchrates.service';
import { SideBarService } from '../../../core/sidemenu/sidemenu.service';
import { GlobalCallComponent } from '../../../globalrates/global-call/global-call.component';
import { SearchRate } from '../../../rates/model/searchRates';
import { Country } from '../../../rates/model/country';
import { PopularRate } from '../../../shared/model/popularRate';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { CurrentSetting } from '../../../core/models/current-setting';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CountriesService } from '../../../core/services/country.service';
import { MetaTagsService } from 'app/core/services/meta.service';
import { TryUsFreeComponent } from '../try-us-free/try-us-free.component';
import { GlobalRatesService } from 'app/home/globalrates.service';
@Component({
  selector: 'app-lowest-rate',
  templateUrl: './lowest-rate.component.html',
  styleUrls: ['./lowest-rate.component.scss']
})
export class LowestRateComponent implements OnInit, OnDestroy {

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
  currentClickedChar: string = "All";

  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  showMore = false;
  showButton = true;
  tblClass:any='two_columns';
  showDropdown:boolean =false;
   currentCurrency:any;
  constructor(private router: Router,
    private titleService: Title,
    private searchRatesService: SearchRatesService,
     
    private razaEnvService: RazaEnvironmentService,
    private sideBarService: SideBarService,
    private countryService: CountriesService, 
    public dialog: MatDialog, 
    private globalRatesService: GlobalRatesService,
    public dialogRef: MatDialogRef<TryUsFreeComponent>,
    ) {
    this.sideBarService.toggle();

  }

  isVisibleFaq(){
    this.showMore = true;
    this.showButton = false;
   }
   
  ngOnInit() {
    this.titleService.setTitle('Search rates');
     
 
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
        this.setcurrentCurrency();
         
        
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
  sortArray(dataArray){
    const sortedArray = dataArray.sort((a, b) => {
        const countryNameA = a.CountryName.toLowerCase();
        const countryNameB = b.CountryName.toLowerCase();
    
        if (countryNameA < countryNameB) {
            return -1;
        }
        if (countryNameA > countryNameB) {
            return 1;
        }
        return 0;
    });
    
    return sortedArray;
    }
  async initAllRates() {
    
    this.globalRatesService.getAllCountriesRates(this.currentSetting.currentCountryId).subscribe(
      (data: any) => {
        this.allCountry = data
        this.searchRates = data;
       
      this.displayCountryList('All')
      },
      (err: ApiErrorResponse) => console.log(err),
    )

    //  await this.searchRatesService.getAllCountries().subscribe(
    //   (data: Country[]) => {
    //     this.allCountry = data;
    //   },
    //   (err: ApiErrorResponse) => console.log(err),
    // );

    const data =  await this.searchRatesService.getAllCountries().toPromise();
     
    
    
    // await this.searchRatesService.getSearchRates(this.currentSetting.currentCountryId).subscribe(
    //   (data: SearchRate[]) => {
    //   this.searchRates = data;
       
    //   this.displayCountryList('All')
        
    //   },
    //   (err: ApiErrorResponse) => console.log(err),
    // );

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
    if(this.isDisabled(character) && character != 'All') 
    return false;
    if(character == 'All' )
    {
      this.currentClickedChar = character;
      const filterValue = character.toLowerCase();
      this.bindSearchRates = this.sortArray(this.searchRates) ;

    }
    else{
      this.currentClickedChar = character;
      const filterValue = character.toLowerCase();
      this.bindSearchRates = this.searchRates.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);

    }

    this.getWidthClass();
 }

  private _filter(value: any): Country[] {
    const filterValue = value.toLowerCase();
    if(this.allCountry && this.allCountry.length > 0)
    {
      return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
    }
    
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

    this.closeIcon()
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
      
  }
  getImageName(name:any)
  {
    return name.replace(/\s+/g, '');
  }

  closeIcon(): void {
    this.dialogRef.close();
  }


  isDisabled(  char)
  {
   
    const filterValue = char.toLowerCase();
    if(this.allCountry && this.allCountry.length > 0)
    {
      let filterlistdata =  this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
      return filterlistdata.length>0?false:true;
    }
  
  }
  getWidthClass()
  {
    if(this.bindSearchRates && this.bindSearchRates.length == 1)
    {
      this.tblClass = 'full_width';
    }
    else
    {
      this.tblClass = 'two_column';
    }
  }
}
