import { Component, OnInit } from '@angular/core';
 
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ApiErrorResponse } from 'app/core/models/ApiErrorResponse';
import { Country } from 'app/core/models/country.model';
import { CurrentSetting } from 'app/core/models/current-setting';
import { CountriesService } from 'app/core/services/country.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GlobalRatesService } from '../home/globalrates.service';
import { SearchRatesService } from '../rates/searchrates.service'; 
import { GlobalCallComponent } from '../globalrates/global-call/global-call.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  country:string;
  countryFrom: Country[];
  currentSetting: CurrentSetting;
  
  currentSetting$: Subscription;
  filteredCountry: any[];
  allCountry: any[];
  constructor(private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private countryService: CountriesService,
    private globalRatesService: GlobalRatesService,
    private searchRatesService: SearchRatesService,
    private razaEnvService: RazaEnvironmentService,
    ) { }

  ngOnInit(): void {

    this.country = this.route.snapshot.params.country;

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
     // this.getActivePromotion(this.currentSetting.currentCountryId);
    })
     
     
    this.getCountryFrom();
    this.searchRates();
    
     
  }
  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }
  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
     
      
    });
  }

  private searchRates() {
    this.globalRatesService.getAllCountriesRates(this.currentSetting.currentCountryId).subscribe(
      (data: any) => {
        this.allCountry = data;
        this.filteredCountry = this._filter(this.country);
        console.log(this.filteredCountry);
        if(this.filteredCountry.length >0)
        this.viewRates(this.filteredCountry[0].CountryId)
        else
        this.router.navigate(['/']);
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }


  viewRates(countryId) {
     
 if(this.currentSetting.currentCountryId != 3 )
{
      localStorage.setItem('rate_country_id', countryId);
      this.router.navigate(['globalcallrates']);
}
else
 { 
   localStorage.removeItem('rate_country_id');
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
    
     
  }


}
