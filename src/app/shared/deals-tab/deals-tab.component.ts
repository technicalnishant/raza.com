import { Component, OnInit,ViewEncapsulation, ElementRef} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CountriesService } from '../../core/services/country.service';
import { Country } from '../../core/models/country.model';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { SupportService } from '../../home/service/support.service';
import { Promotion } from '../../deals/model/Promotion';
import { PromotionResolverService } from '../../deals/services/promotion-resolver.service';

@Component({
  selector: 'app-deals-tab',
  templateUrl: './deals-tab.component.html',
  styleUrls: ['./deals-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DealsTabComponent implements OnInit {

filteredCountry: Observable<any[]>;
 
  allCountry: any[];
  countryFrom: Country[]

  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  isAuthenticated: boolean = false;
   
  currentCurrency:any;
  
  
  constructor(
  private countryService: CountriesService,
  private razaEnvService: RazaEnvironmentService,
    public dialog: MatDialog,
     
    private supportService: SupportService,
     
    private promotionResolverService: PromotionResolverService,
	) { }
  data = [
         
          
      
         
  			  
  			  
			 /* {
			   main_img:"../../../assets/images/promotion/deal_dropdown.png",
			   img2:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/india-20-white.png',
			   img1:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/india-20-dark.png',
			  page_link:"/deals/THANKS2020",      
			 page_link_id:5,
			   content:" <p>Happy Diwali</p><span>Get upto 20% bonus minutes.</span>"
			 },*/
     /* {
        main_img:"https://d2uij5nbaiduhc.cloudfront.net/images/india-bg-new_xgv0ek.webp",
        img1:'https://d2uij5nbaiduhc.cloudfront.net/images/guyana_icon_black.png',
        img2:'https://d2uij5nbaiduhc.cloudfront.net/images/guyana_icon_blue.png',
        page_link:"/deals/page/guyana",
        page_link_id:1,
        content:"<p>Guyana Special</p><span>Starting as low as 4.6 Cents per min.</span>"
      },*/
			  
			 {
        
  				main_img:"https://d2uij5nbaiduhc.cloudfront.net/images/deal-desk1_brbcfp.webp",
  				img1:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deals_icon_2.png',
  				img2:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deals_icon_white_2.png',
				page_link:"/deals/get-upto-1500",
				page_link_id:2,
  				content:"<small>Get up to</small><p>1500 Free Mins</p><span>to call india, Pakistan, Nepal</span>"
  			},
  			{
  				main_img:"https://d2uij5nbaiduhc.cloudfront.net/images/deal-desk2_bvlycp.webp",
  				img1:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deals_icon_3.png',
  				img2:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deals_icon_white_3.png',
          page_link:"/deals/india-one-cent",
		  page_link_id:3,
  				content:"<p>India 1¢ Plan</p><span>Starting low as 1cent</span>"
  			},
  			{
  				main_img:"https://d2uij5nbaiduhc.cloudfront.net/images/deal-desk3_ja9p0v.webp",
  				img1:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deals_icon_4.png',
  				img2:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deals_icon_white_4.png',
          page_link:"/deals/buy1-get1",

		  page_link_id:4,
  				content:"<p>Buy 1 Get 1 FREE</p><span>New Customer Offer</span>"
  			},
        {
          main_img:"https://d2uij5nbaiduhc.cloudfront.net/images/india-bg-new_xgv0ek.webp",
         img1:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deal_icon_black1.png',
          img2:'https://d2uij5nbaiduhc.cloudfront.net/images/deals/deals_icon_1.png',
         page_link:"/deals/india-unlimited",
         page_link_id:1,
          content:"<p>India Monthly Plans</p><span>Starting as low as $9.99</span>"
        }
  		];
  	main_img = 'https://d2uij5nbaiduhc.cloudfront.net/images/india-bg-new_xgv0ek.webp';
  ngOnInit(): void {
  
  this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
	
  }
  // onopenchristmas(el: ElementRef) {
  //   const pr: Promotion = {
  //     PromotionCode: "THANKS2020",
  //     PromotionName: "Upto 20% Extra",
  //     Description: "To anywhere in the world",
  //     CountryFrom: 1,
  //     Icon: "indiaunlimited-logo.png",
  //     BannerNav: "indiaunlimited-thumbnail.jpg",
  //     LandingPageImage: null,
  //     MobileThumbnail: "indiaunlimited-logo.png",
  //     IsGroupedPromotion: false,
  //     Template: "DealPopupViewComponwnt",
  //     IsPopupView: true,
  //     InstanceId: 0,
  //     Plans: [],
  //     component: ''
  //   }
  //   this.promotionResolverService.openPromotion(pr, this.currentSetting.currentCountryId);
  // }
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
