import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
//import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { SideBarService } from '../../core/sidemenu/sidemenu.service';
import { GlobalRatesService } from '../globalrates.service';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { SearchRatesService } from '../../rates/searchrates.service';
import { GlobalCallComponent } from '../../globalrates/global-call/global-call.component';

import { MatDialog } from '@angular/material/dialog';
import { CountriesService } from '../../core/services/country.service';
import { Country } from '../../core/models/country.model';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../core/models/current-setting';
//import { isNullOrUndefined } from 'util';
import { SupportService } from '../service/support.service';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { Promotion } from '../../deals/model/Promotion';
import { PromotionResolverService } from '../../deals/services/promotion-resolver.service';
import { Platform } from '@angular/cdk/platform';
import { isNullOrUndefined } from "../../shared/utilities";
import { TestimonialsComponent } from '../../shared/testimonials/testimonials.component';

import { AuthenticationService } from '../../core/services/auth.service';
import { SignuppopupComponent } from '../../core/signuppopup/signuppopup.component';
import { MatButtonModule } from '@angular/material/button';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { HostListener } from '@angular/core';

import { HowWorksComponent } from '../../shared/dialog/how-works/how-works.component';
import { FaqPageComponent } from '../../shared/dialog/faq-page/faq-page.component';
import { LoginpopupComponent } from '../../core/loginpopup/loginpopup.component';
import { ModalVideoComponent } from '../modal-video/modal-video.component';

import { MetaTagsService } from '../../core/services/meta.service';
import { PreviousRouteService } from '../../core/services/previous-route.service';
// import{GoogleAnalyticsService} from '../../services/google-analytics.service';
// declare var videojs: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {



  headerValue: number = 1;
  // slideConfig = { "slidesToShow": 3, "slidesToScroll": 2 };
  slideConfig = {
    "slidesToShow": 3, "slidesToScroll": 2,
    'responsive': [{
      'breakpoint': 769,
      'settings': {
        'slidesToShow': 2,
        'slidesToScroll': 1,
        'arrows': false,
        'dots': false
      }
    }]
  };
  stateCtrl = new FormControl();
  searchicon: string = 'https://d2uij5nbaiduhc.cloudfront.net/images/search8.svg';
  id: number = 1;
  filteredCountry: Observable<any[]>;
  showPlaceholder: boolean = true;
  showDropdown: boolean = false;
  selectedMap: string = 'flag flag-ad';
  serchdata: any; autoControl = new FormControl();
  allCountry: any[];
  countryFrom: Country[]

  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  isAuthenticated: boolean = false;
  appLinkForm: FormGroup;
  currentCurrency:any;
  contentLoaded: boolean = false;
  isFixHeader: boolean = false;
  //promtionCode:string='RAMADAN2023';
  //promtionCode:string='EID2023';
  promtionCode:string='MA2023';
  currentURL:any;
  defaultImage = '';
  previousUrl:any='';
  image_1 = 'https://d2uij5nbaiduhc.cloudfront.net/images/slider-bg.webp';
  image_2 = 'https://d2uij5nbaiduhc.cloudfront.net/images/buy1get1.webp';
  image_3 = 'https://d2uij5nbaiduhc.cloudfront.net/images/buy1get1.webp';
  image_4 = 'https://d2uij5nbaiduhc.cloudfront.net/images/was10now5.webp';
  image_5 = 'https://d2uij5nbaiduhc.cloudfront.net/images/uk_left.webp';
  image_6 = 'https://d2uij5nbaiduhc.cloudfront.net/images/mobile-uk.webp';

  @ViewChild('typedEl',{static: true}) typedEl: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private sideBarService: SideBarService,
    private globalRatesService: GlobalRatesService,
    private searchRatesService: SearchRatesService,
    private countryService: CountriesService,
    public dialog: MatDialog,
    private razaEnvService: RazaEnvironmentService,
    private fb: FormBuilder,
    private supportService: SupportService,
    private razaSnackBarService: RazaSnackBarService,
    private promotionResolverService: PromotionResolverService,
    public platform: Platform,
	private authService: AuthenticationService,
  private metaTagsService:MetaTagsService,
  private previousRouteService: PreviousRouteService,
  @Inject(DOCUMENT) private document: Document,
  //public googleAnalyticsService: GoogleAnalyticsService

  ) {
    this.sideBarService.toggle();
    router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      console.log('prev:', event.url);
      this.previousUrl = event.url;
    });
  }


  ngOnInit() {
  /******************* Remember & redirect rate page search functioanlity ********************/

    let previous = this.previousRouteService.getPreviousUrl();
    let currnet = this.previousRouteService.getCurrentUrl();
    
    console.log("currnet page path is ", currnet);
    console.log("previous page path is ", previous);

    if(previous == '/globalcallrates' && currnet == '/')
    {
      localStorage.removeItem('history_search_country_id');
       
    }
    else if(previous != '/globalcallrates' && previous != '/')
    {
      localStorage.removeItem('history_search_country_id')
     
    }
   else if( localStorage.getItem('history_search_country_id') && parseFloat(localStorage.getItem('history_search_country_id'))> 0) 
    {
     
     localStorage.setItem('rate_country_id', localStorage.getItem('history_search_country_id'));
     //localStorage.removeItem('history_search_country_id')
     this.router.navigate(['globalcallrates']); 
    }
    

    
    
    if(previous == '/mobiletopup' && currnet == '/')
    {
      localStorage.removeItem("topupCountry");
      localStorage.removeItem("topupPhone");
      localStorage.removeItem("topupCountryId");
      localStorage.removeItem("topupTrigger");
       
    }
    else if(previous != '/mobiletopup' && previous != '/')
    {
      localStorage.removeItem("topupCountry");
      localStorage.removeItem("topupPhone");
      localStorage.removeItem("topupCountryId");
      localStorage.removeItem("topupTrigger");
     
    }
   else if( localStorage.getItem('topupCountryId') && parseFloat(localStorage.getItem('topupCountryId'))> 0) 
    {
     
      
     this.router.navigate(['mobiletopup']); 
    }


/******************* EOF Remember & redirect  rate page search functioanlity ********************/



    window.scroll({ 
      top: 10, 
      left: 0, 
      behavior: 'smooth' 
  });
   // this.googleAnalyticsService.eventEmitter("home_page", "Home page", "Home page", "page load", 1);

    this.defaultImage   = 'https://miro.medium.com/max/441/1*9EBHIOzhE1XfMYoKz1JcsQ.gif';
    this.image_1        = 'https://d2uij5nbaiduhc.cloudfront.net/images/slider-bg.webp';
    this.image_2        = 'https://d2uij5nbaiduhc.cloudfront.net/images/buy1get1.webp';
    this.image_3        = 'https://d2uij5nbaiduhc.cloudfront.net/images/buy1get1.webp';
    this.image_4        = 'https://d2uij5nbaiduhc.cloudfront.net/images/was10now5.webp';
    this.image_5        = 'https://d2uij5nbaiduhc.cloudfront.net/images/uk_left.webp';
    this.image_6        = 'https://d2uij5nbaiduhc.cloudfront.net/images/mobile-uk.webp';

  
    this.currentURL = window.location.href;
    if(this.currentURL.includes('/ref/')) 
    { 
 
    if(this.route.snapshot.params['signup_code'] && this.route.snapshot.params['signup_code']!='')
    {
      var code = this.route.snapshot.params['signup_code'];
      localStorage.setItem('promo_code', code);
      
      this.signupModal();
    }
  }
    

  if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
     
    }
	
    this.titleService.setTitle('Free International calls with Raza calling app');
    const isNeedToScrollMobileApp = this.route.snapshot.data['scrollToMobileApp'];

    this.metaTagsService.getMetaTagsData('home');

    if (isNeedToScrollMobileApp) {
      this.scrollToMobileApp();
    }

    this.appLinkForm = this.fb.group({
      phoneNumber: ['', Validators.required]
    });

    this.id = 1;
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });

    this.filteredCountry = this.autoControl.valueChanges
      .pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
        map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      );

    //this.getCountryFrom(); //04-01-23

    if (!isNullOrUndefined(this.currentSetting)) {
     // this.searchRates(); //04-01-23
    }


    let videoOptions: any = {
      loop: true,
      controls: true,
      muted: true,
      autoplay: true,
      videoWidth: 360,
      videoHeight: 815
    };

    // var player = videojs('my-player', videoOptions, function onPlayerReady() {
    //   videojs.log('Your player is ready!');

    //   // In this context, `this` is the player that was created by Video.js.
    //   this.play();
    // });
	setTimeout(() => {
      this.contentLoaded = true;
    }, 4000);

    if(this.route.snapshot.queryParamMap.get('promo') && this.route.snapshot.queryParamMap.get('promo')!='')
    {
      this.promtionCode = this.route.snapshot.queryParamMap.get('promo');
      this.onopenPromotion();
     
    }

    localStorage.removeItem('IsMoto');
    localStorage.removeItem('moto_orderid')
  }

   

  openDialog() {
    this.dialog.open(ModalVideoComponent,{
      panelClass: 'mobile-video-dialog', //======> pass your class name
  });
  }
  ngAfterViewInit(): void {
    // const options = {
    //   strings: ['Stay Safe & Keep Talking', 'Get up to 20% bonus'],
    //   typeSpeed: 130,
    //   backSpeed: 130,
    //   showCursor: true,
    //   smartBackspace: true,
    //   cursorChar: '|',
    //   loop: true
    // };

    // const typed = new Typed('.typed-element', options);
    
  }
  
  ngAfterViewChecked(){
    
  }
  ngOnDestroy(): void {
    this.currentSetting$.unsubscribe();
  }

  private scrollToMobileApp() {
    window.scrollTo(1650, 1650);
  }

  cliclDownloadAppFree(el: HTMLElement) 
  {
    if (this.platform.ANDROID) {
      window.open('https://cutt.ly/7eFSBtF', 'blank')
    } else if (this.platform.IOS) {
      window.open('https://cutt.ly/ReFSGpW', 'blank')
    }
    else {
      el.scrollIntoView();
      
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  private searchRates() {
    this.globalRatesService.getAllCountriesRates(this.currentSetting.currentCountryId).subscribe(
      (data: any) => {
        this.allCountry = data;
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }

  viewRates(event, countryId) {
    if (event.isUserInput) {
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

  displayFn(country?: any): string | undefined {
    return country ? country.CountryName : undefined;
  }

  
  onopenPromotion() {
    const pr: Promotion = {
      PromotionCode: this.promtionCode,
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

  onopenchristmas(el: ElementRef) {
    const pr: Promotion = {
      PromotionCode: this.promtionCode,
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

  onClickInput() {
    this.searchicon = 'https://d2uij5nbaiduhc.cloudfront.net/images/search8.svg';
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
    window.location.reload();
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
  onInputFocus() {
    this.searchicon = 'https://d2uij5nbaiduhc.cloudfront.net/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;
  }

  onClickClose(icon) {
    if (icon == 'https://d2uij5nbaiduhc.cloudfront.net/images/cross8.png') {
      this.searchicon = 'https://d2uij5nbaiduhc.cloudfront.net/images/search8.svg';
    }
    this.showDropdown = false;
  }

  onClickPlaceholder() {
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }

  redirectToBy1Get1() {
    this.router.navigate(['/deals/buy1-get1']);
  }

  sendAppLink() {
    if (!this.appLinkForm.valid) {
      return;
    }
    this.supportService.sendAppLink(this.appLinkForm.value.phoneNumber).subscribe(res => {
      this.razaSnackBarService.openSuccess('Sms has been sent to your number.')
    })

  }
  signupModal() {
  if (this.authService.isAuthenticated()) {
		 this.router.navigate(['account/overview'])
		}
		else
		{
				this.dialog.open(SignuppopupComponent, {
			 
			  data: {  }
			});
		}
 	 
  }

  buy1get1() {
    this.router.navigate(["/deals/buy1-get1"]).catch(err => {
    });
  }


  enrollNow() {
    if (this.authService.isAuthenticated()) {
       this.router.navigate(['account/rewards'])
      }
      else
      {

          localStorage.setItem('redirect_path', 'account/rewards');
          this.dialog.open(LoginpopupComponent, {         
          data: {  }
        });
      }
      
    }

    rewardLearnMore(obj:number) {
        // localStorage.setItem('redirect_path', 'account/rewards');
        // this.router.navigate(['/features'])//, { state: { pin: obj.Pin, iso:iso } }
         this.router.navigateByUrl('features', { state: { slid: obj} });
        }


	getText()
	{
		if (this.authService.isAuthenticated()) {
		return 'Go to my account';
		}
		else{
		return 'Create an account';
		}
	}

	howItWorksPopup(obj) {
	 
    this.dialog.open(HowWorksComponent, {
     
      data: { slideIndex: obj }
    });
  }
 
  faqPopup(obj) {
    this.dialog.open(FaqPageComponent, {
      data: { slideIndex: obj }
    });
  }

  downloadApp() {
    /*var platform = ["Win32", "Android", "iOS"];
    var user_platform = '';
    for (var i = 0; i < platform.length; i++) {
 
        if (navigator.platform.indexOf(platform[i]) >- 1) {

          user_platform = platform[i];
        }
    }

    if(user_platform == "iOS")
    {
      window.location.href = 'https://apps.apple.com/ca/app/raza-universe/id1226298666';
    }
    else{
      window.location.href = 'https://play.google.com/store/apps/details?id=com.razacomm.universe';
    }*/
	
	
	if (this.platform.ANDROID) {
      window.open('https://play.google.com/store/apps/details?id=com.razacomm.universe', 'blank')
    } else if (this.platform.IOS) {
      window.open('https://apps.apple.com/ca/app/raza-universe/id1226298666', 'blank')
    }
    else {
      window.open('https://play.google.com/store/apps/details?id=com.razacomm.universe', 'blank')
      
    }
   
	

 }



 
 goTomobileTopup()
 {
  localStorage.removeItem("topupCountry");
  localStorage.removeItem("topupPhone");
  localStorage.removeItem("topupCountryId");
  localStorage.removeItem("topupTrigger");
  this.router.navigateByUrl('mobiletopup');
  
 }
  
  

}
