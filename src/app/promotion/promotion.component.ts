import { Component, OnInit ,NgModule,ViewEncapsulation ,HostListener,ElementRef} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { PromotionResolverService } from '../deals/services/promotion-resolver.service';
import { Observable, Subscription } from 'rxjs';
import { CountriesService } from '../core/services/country.service';
import { Promotion } from '../deals/model/Promotion';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { CurrentSetting } from '../core/models/current-setting';
import { SupportService } from '../home/service/support.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PromotionComponent implements OnInit {
 
  innerWidth:any;
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
   
  
  constructor(
  private countryService: CountriesService,
  private razaEnvService: RazaEnvironmentService,
    public dialog: MatDialog,
     
    private supportService: SupportService,
     
    private promotionResolverService: PromotionResolverService,
  ) { }
  prop = 50;
   data = [
	{   
           
          bg_img: "./assets/images/promotions/newyear/bonus20-bg.png",
          left_image : "./assets/images/promotions/newyear/belloon-left.png",
          center_img: "./assets/images/promotions/newyear/bonus20.png",
          btn_img:"./assets/images/promotions/christmas/viewmore-button.png",
          btn_text : "VIEW OFFERS",
          url_text : "",
          diclaimer : "Limited time promo offer. Promo credits applied after activation",

        },
        {  
           
          bg_img: "./assets/images/promotions/newyear/buy5-bg.jpg",
          center_img: "./assets/images/promotions/newyear/buy5get5.png",
          btn_img:"./assets/images/promotions/christmas/viewmore-button.png",
          btn_text : "VIEW OFFERS",
          url_text : "buy_five_get_five",
        }  ];

        mobdata = [
          {   
                   
            bg_img: "./assets/images/promotions/newyear/home-m-bg.jpg",
            center_img: "./assets/images/promotions/newyear/home-m-offer.png",
            btn_text : "VIEW OFFERS",
            url_text : "",
          },
          {  
              
            bg_img: "./assets/images/promotions/newyear/buy5get5-mobile.jpg",
            center_img: "./assets/images/promotions/newyear/buy5get5-mobile.png",
            btn_text : "VIEW OFFERS",
            url_text : "buy_five_get_five",
          }  ];


   


 


  ngOnInit(): void {
        this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });


     
  }
   
  onopenchristmas(el: ElementRef) {
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
