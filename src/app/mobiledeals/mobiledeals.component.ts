import { Component, OnInit, OnDestroy,ViewEncapsulation, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import {MatIconModule} from '@angular/material/icon';

import { RazaLayoutService } from '../core/services/raza-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';

import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CountriesService } from '../core/services/country.service';
import { Country } from '../core/models/country.model';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { CurrentSetting } from '../core/models/current-setting';
import { SupportService } from '../home/service/support.service';
import { Promotion } from '../deals/model/Promotion';
import { PromotionResolverService } from '../deals/services/promotion-resolver.service';



@Component({
  selector: 'app-mobiledeals',
  templateUrl: './mobiledeals.component.html',
  styleUrls: ['./mobiledeals.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MobiledealsComponent implements OnInit {
	isSmallScreen;
	filteredCountry: Observable<any[]>;
	allCountry: any[];
	countryFrom: Country[];
	currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  isAuthenticated: boolean = false;
   
  currentCurrency:any;
  
  
  constructor(private razalayoutService: RazaLayoutService,
  private breakpointObserver: BreakpointObserver,
  
    private countryService: CountriesService,
    private razaEnvService: RazaEnvironmentService,
    public dialog: MatDialog,
     
    private supportService: SupportService,
     
    private promotionResolverService: PromotionResolverService,
  ) { }

  ngOnInit(): void {
  this.razalayoutService.setFixedHeader(true);
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
 


this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      console.log(res);
    });
	
 }	
	
 //onopenchristmas(el: ElementRef) {
 onopenchristmas() {
  const pr: Promotion = {
    PromotionCode: "NY2023",
      PromotionName: "Upto 20% Extra",
      Description: "To anywhere in the world",
      CountryFrom: 1,
      Icon: "indiaunlimited-logo.png",
      BannerNav: "indiaunlimited-thumbnail.jpg",
      LandingPageImage: null,
      MobileThumbnail: "indiaunlimited-logo.png",
      IsGroupedPromotion: false,
      Template: "DealPopupViewComponwnt",
      IsPopupView: true,
      InstanceId: 0,
      Plans: [],
      component: ''
  }
  this.promotionResolverService.openPromotion(pr, this.currentSetting.currentCountryId);
}
}
