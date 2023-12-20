import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, AfterViewChecked, NgModule} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { SideBarService } from '../../core/sidemenu/sidemenu.service';
import { GlobalRatesService } from '../globalrates.service';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { SearchRatesService } from '../../rates/searchrates.service';
import { GlobalCallComponent } from '../../globalrates/global-call/global-call.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CountriesService } from '../../core/services/country.service';
import { Country } from '../../core/models/country.model';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { SupportService } from '../service/support.service';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { Promotion } from '../../deals/model/Promotion';
import { PromotionResolverService } from '../../deals/services/promotion-resolver.service';
import { Platform } from '@angular/cdk/platform';
import { isNullOrUndefined } from "../../shared/utilities";
//import { TestimonialsComponent } from '../../shared/testimonials/testimonials.component';

import { AuthenticationService } from '../../core/services/auth.service';
import { SignuppopupComponent } from '../../core/signuppopup/signuppopup.component';
//import { MatButtonModule } from '@angular/material/button';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
//import { HostListener } from '@angular/core';
import { HowWorksComponent } from '../../shared/dialog/how-works/how-works.component';
import { FaqPageComponent } from '../../shared/dialog/faq-page/faq-page.component';
import { LoginpopupComponent } from '../../core/loginpopup/loginpopup.component';
import { ModalVideoComponent } from '../modal-video/modal-video.component';
import { MetaTagsService } from '../../core/services/meta.service';
import { PreviousRouteService } from '../../core/services/previous-route.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Buy1get1Component } from 'app/core/dialog/buy1get1/buy1get1.component';
import { LowestRateComponent } from 'app/core/dialog/lowest-rate/lowest-rate.component';
// import Splide from '@splidejs/splide';
export class SomeModule { }
// import{GoogleAnalyticsService} from '../../services/google-analytics.service';
// declare var videojs: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    nav: false,
    items: 1,
    lazyLoad: true,
  }

sliderAutoplay: boolean = true;
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
  //promtionCode:string='';
  promtionCode:string='XMAS2023';
  currentURL:any;
  defaultImage = '';
  previousUrl:any='';
  loadTestimonials:boolean=false;
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
     
      this.previousUrl = event.url;
    });
  }

  
 

  
  ngAfterViewInit(): void {
  
    
  }

  ngOnInit() {
  /******************* Remember & redirect rate page search functioanlity ********************/
  // Simulate a delay of 2 seconds before loading the child component

  
  setTimeout(() => {
    this.loadTestimonials = true;
  }, 5000);

    let previous = this.previousRouteService.getPreviousUrl();
    let currnet = this.previousRouteService.getCurrentUrl();
    

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

      console.log("this.route.snapshot.params['signup_code']", this.route.snapshot.params['signup_code']);
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

    if (!isNullOrUndefined(this.currentSetting)) {
   
    }


    let videoOptions: any = {
      loop: true,
      controls: true,
      muted: true,
      autoplay: true,
      videoWidth: 360,
      videoHeight: 815
    };

	setTimeout(() => {
      this.contentLoaded = true;
    }, 4000);

    if(this.route.snapshot.queryParamMap.get('promo') && this.route.snapshot.queryParamMap.get('promo')!='')
    {
      this.promtionCode = this.route.snapshot.queryParamMap.get('promo');
      this.onopenPromotion();

    }

    if(this.route.snapshot.params['promo'] && this.route.snapshot.params['promo'] !='')
    {
      this.promtionCode = this.route.snapshot.params['promo'];
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

  signupModal() 
  {
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

    rewardLearnMore(obj:number) 
    {
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

  downloadApp() 
  {
    if (this.platform.ANDROID) {
      window.open('https://play.google.com/store/apps/details?id=com.razacomm.universe', 'blank')
    } 
    else if (this.platform.IOS) 
    {
      window.open('https://apps.apple.com/ca/app/raza-universe/id1226298666', 'blank')
    }
    else
     {
      window.open('https://play.google.com/store/apps/details?id=com.razacomm.universe', 'blank')
    }
 }




 goTomobileTopup()
 {
  if(this.authService.isAuthenticated())
      {
        this.router.navigate(['/account/international-topup']);
      }
      else
      {
        localStorage.removeItem("topupCountry");
        localStorage.removeItem("topupPhone");
        localStorage.removeItem("topupCountryId");
        localStorage.removeItem("topupTrigger");
        this.router.navigateByUrl('mobiletopup');
      }
  }


  buyOnegetOne()
  {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.panelClass = "tryUsFree";
    dialogConfig.width = "100%";
    dialogConfig.height = "90%";
    dialogConfig.data = {
      name: "buy1get1",
      title: "Buy1 Get1", 
    }
    const modalDialog = this.dialog.open(Buy1get1Component, dialogConfig);
  }

  showLowestRates()
  {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.panelClass = "tryUsFree";
    dialogConfig.width = "100%";
    dialogConfig.height = "90%";
    dialogConfig.data = {
      name: "Lowest rates",
      title: "Lowest rates",
       
    }
    const modalDialog = this.dialog.open(LowestRateComponent, dialogConfig);
  }
}
