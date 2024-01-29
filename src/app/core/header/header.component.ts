import { Component, OnInit, HostListener, EventEmitter, Output, ViewChild, ElementRef, Input, AfterViewInit, Renderer2 } from '@angular/core';

import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RazaEnvironmentService } from '../services/razaEnvironment.service';
import { RazaLayoutService } from '../services/raza-layout.service';
import { Promotion } from '../../deals/model/Promotion';
import { PromotionsService } from '../../deals/services/promotions.service';
import { CurrentSetting } from '../models/current-setting';
import {  Observable, Subscription } from 'rxjs';
import { GlobalCallIndiaComponent } from '../../globalrates/global-call-india/global-call-india.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PromotionResolverService } from '../../deals/services/promotion-resolver.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthenticationService } from '../services/auth.service';

import { CountriesService } from '../../core/services/country.service';
import { Country } from '../../core/models/country.model';

import { LoginpopupComponent } from '../loginpopup/loginpopup.component';
import { SearchRatesService } from '../../rates/searchrates.service';
import { GlobalCallComponent } from '../../globalrates/global-call/global-call.component';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { map, startWith } from 'rxjs/operators';
import { isNullOrUndefined } from "../../shared/utilities";
import { GlobalRatesService } from '../../home/globalrates.service';

import { Event, NavigationStart, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';
import { PreviousRouteService } from '../services/previous-route.service';
import { TryUsFreeComponent } from '../dialog/try-us-free/try-us-free.component';
import { RazaSnackBarService } from 'app/shared/razaSnackbar.service';
import { CustomErrorComponent } from 'app/shared/dialog/custom-error/custom-error.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnInit  {
  ngAfterViewInit(): void {
    //console.log('dee',this.dealDropdown);
  }
  dealselected: any = 1;
  mode = new FormControl('over');
  headerValue: number = 1;
  isFixHeader: boolean = false;
  activePromotions: Promotion[];
  currentSetting: CurrentSetting;
  currentSetting$: Subscription;
  @Input() sidenav: MatSidenav;

  @ViewChild('accountDropMenuTrigger',{static: true}) dropMenu: MatMenuTrigger;
  @ViewChild('myDEAL',{static: true}) myDEAL: ElementRef<HTMLElement>;
  @ViewChild('dealDropdown',{static: true}) dealDropdown: ElementRef;
  @ViewChild('dropdown',{static: true}) dealsDropMenu: ElementRef;
  isAuthenticated: boolean = false;
  isAuthenticatedn: boolean = false;
  isAccountMenuDisplay: boolean = false;
  isSmallScreen: boolean=false;
  currentCurrency:any;
  showDropdown: boolean = false;
  allCountry: any[];
  countryFrom: Country[];
  userInfo: any[];
  currentURL:any;
  searchicon: string = '../assets/images/search8.svg';
  id: number = 1;
  blueBg: number = 0;
  filteredCountry: Observable<any[]>;
  showPlaceholder: boolean = true;
  stateCtrl = new FormControl();
  selectedMap: string = 'flag flag-ad';
  serchdata: any; autoControl = new FormControl();
  showHeader:boolean=true;
  showMyaccontHeader:boolean=false;
  frameborder:boolean=false;
  selected_country:string='';
  filter_string:string=''
  ctryName:any;
  previousUrl:any ='';
  navClick:any='hide_nav';
  otherPlans:boolean=false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private razaLayoutService: RazaLayoutService,
    private promotionService: PromotionsService,
    public dialog: MatDialog,
    public matDialog: MatDialog,
    private razaEnvService: RazaEnvironmentService,
    private promotionResolverService: PromotionResolverService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private countryService: CountriesService,
    private searchRatesService: SearchRatesService,
    private globalRatesService: GlobalRatesService,
    public platform: Platform,
    private snackbar: RazaSnackBarService,
    
  )
  {
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
    this.isAccountMenuDisplay = this.isSmallScreen && this.isUserAuthenticated();
    //console.log('sidenav',this.sidenav);
    this.authService.getSharedValue().subscribe(value => {
      this.isAuthenticatedn = value;

    });

}

  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      name: "logout",
      title: "Are you sure you want to logout?",
      description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      actionButtonText: "Logout",
    }
    localStorage.removeItem('redirect_path');
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(LoginpopupComponent, dialogConfig);
  }
  try_us_free()
  {
    
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.panelClass = "tryUsFree";
    dialogConfig.width = "100%";
    dialogConfig.height = "90%";
    dialogConfig.data = {
      name: "logout",
      title: "Are you sure you want to logout?",
      description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      actionButtonText: "Logout",
    }
    const modalDialog = this.matDialog.open(TryUsFreeComponent, dialogConfig);
  }
globalError()
{
  
		var errorMsg = "Our system is under maintenance and our team is working diligently to restore services as quickly as possible. We apologize for any inconvenience caused and appreciate your patience during this time.";
		 
	 
		this.dialog.open(CustomErrorComponent, {
            data: { errorMsg } 
          });  
		 
    }
  ngOnInit() {

   // this.globalError();
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      this.getActivePromotion(this.currentSetting.currentCountryId);
    })



  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {


    localStorage.setItem('last_page', event.url);

    if(event.url == '/' || event.url == '/mobileapp' || event.url == '/p')
    {
      this.showHeader = true;
      this.showMyaccontHeader = false;
      this.blueBg = 0;
      this.setCurrentSetting()
      if (!isNullOrUndefined(this.currentSetting)) {
        this.searchRates();
      }

      //console.log("Your are on home page");

    }
    else if(event.url == '/mobile-page'){
      this.showHeader = true;
      this.showMyaccontHeader = false;
      this.blueBg = 0;
    }
     else if(event.url.includes('/account')){
      this.showMyaccontHeader = true;
      this.showHeader = false;
      if (!isNullOrUndefined(this.currentSetting)) {
        this.searchRates();
      }
    }
    else if(event.url == '/sitemap'){
      this.showHeader = true;
      this.showMyaccontHeader = false;
      this.blueBg = 0;
    }
    else if(event.url == '/mobiletopup'){
      this.showMyaccontHeader = false;
      this.showHeader = false;
    }
    else if(event.url == '/globalcallrates'){
      this.showMyaccontHeader = false;
      // if(window.screen.width > 768)
      // {
      //   this.blueBg = 0;
      // }
      // else{
      //   this.blueBg = 1;
      // }
      this.showHeader = false;
    }

     

    else {
      this.showHeader = false;
      this.blueBg = 0;
    }

    if(event.url.includes('/account/other-plans')){
        this.otherPlans = true;
      }
      else{
        this.otherPlans = false;
      }
  });


      if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      }

    this.razaLayoutService.isFixHeader$.subscribe(res => {
      this.isFixHeader = res;
      if (res) {
          this.headerValue = 2;
      } else {
        this.headerValue = 1;
      }
    });


       this.compareToken();

      // this.filteredCountry = this.autoControl.valueChanges
      // .pipe(
      //   startWith<string | any>(''),
      //   map(value => typeof value === 'string' ? value : value.CountryName),
      //   map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      // );
    this.filterListing();
    this.getCountryFrom();

    if (!isNullOrUndefined(this.currentSetting)) {
     // this.searchRates();
    }

    this.setMobileHeader();
  }
  //this.renderer.setStyle(this.dealsDropMenu.nativeElement, 'display', 'none')

  setCurrentSetting()
  {
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      this.getActivePromotion(this.currentSetting.currentCountryId);
    })
  }
  filterListing(){

    this.filteredCountry = this.autoControl.valueChanges
      .pipe(
        startWith<string | any>(''),
        map(value => typeof value === 'string' ? value : 'A'),
        map(CountryName => CountryName ? this._filter(CountryName) : this.subFilter())
      );
  }

  private subFilter():any[]
  {

    if( this.selected_country != '' && this.selected_country !== null && this.selected_country !== undefined)
    {
      return this._filter(this.selected_country);
    }
    else
    {
      return  this.allCountry;
    }

  }


  setSelection(obj:any)
  {
    this.selected_country = obj
  }

  private _filter(value: any): any[] {
    this.filter_string = value;
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  onClickInput() {
   // this.filterListing();
    this.searchicon = '../assets/images/search8.svg';

  }

  checkClick(e)
  {
    if(e.target.value == '')
    {

      this.selected_country = 'A';
    }
    else
    this.selected_country = e.target.value;

  }

  onInputFocus() {
    this.searchicon = '../assets/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;

  }

  setMobileHeader()
  {
    if(this.blueBg == 1)
    {
      this.headerValue = 1;
    }
  }
  getNumber()
  {
    var number = '1877-463-4233';
    if(this.currentSetting.currentCountryId == 1)
    {
      number = '1877-463-4233';
    }
    if(this.currentSetting.currentCountryId == 2)
    {
      number = '1800-550-3501';
    }
    if(this.currentSetting.currentCountryId == 3)
    {
      number = '+44800-041-8192';
    }

    return number
  }
  cliclDownloadAppFree(el: HTMLElement) {
    if (this.platform.ANDROID) {
      window.open('https://cutt.ly/7eFSBtF', 'blank')
    } else if (this.platform.IOS) {
      window.open('https://apps.apple.com/ca/app/raza-universe/id1226298666', 'blank')
    }
    else {
      //el.scrollIntoView();
      window.open('https://cutt.ly/7eFSBtF', 'blank')
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  

  private searchRates() {
    this.globalRatesService.getAllCountriesRates(this.currentSetting.currentCountryId).subscribe(
      (data: any) => {
        this.allCountry = data;
        this.filterListing();
        //console.log('this.allCountry ', this.allCountry );

      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }
 
  public compareToken()
  {

    if(this.authService.isAuthenticated())
        {
          var userInfo = this.authService.getCurrentLoginUser();

          const date2         = new Date(userInfo.expire);
          const expire_time   = date2.getTime();
          const currentDate   = new Date();
          const timestamp     = currentDate.getTime();

          //if( expire_time > timestamp)
          if( timestamp >= expire_time)
           {
              this.authService.refreshLogin();
           }

    }
  }
  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;

    });
  }

  onClickPlaceholder() {
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }

  clickRecharge()
  {
    if(this.authService.isAuthenticated())
    {
      this.router.navigate(['/account/overview']);
    }
    else
    {

      this.router.navigate(['/recharge/quick']);

      // const dialogConfig = new MatDialogConfig();

      // dialogConfig.disableClose = true;
      // dialogConfig.id = "modal-component";
      // dialogConfig.height = "350px";
      // dialogConfig.width = "600px";
      // dialogConfig.data = {
      //   name: "logout",
      //   title: "Are you sure you want to logout?",
      //   description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      //   actionButtonText: "Logout",
      // }

      // const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
    }
  }
  closeIconLogin(){}
  closeIcon(){
  //   console.log('dealsDropMenu', this.dealsDropMenu);
    //this.renderer.setStyle(this.dealsDropMenu.nativeElement, 'display', 'none')
  }

  getActivePromotion(countryId: number) {
    // this.promotionService.getActivePromotions(countryId).subscribe(res => {
    //   this.activePromotions = res;
    // })

  }

  onopenchristmasheader() {

    if (this.dialog.openDialogs.length == 0) {
      this.dialog.open(GlobalCallIndiaComponent, {
        width: '83vw',
        maxWidth: '1235px'
      });

    }
  }

  toggleSideNav() {
    this.sidenav.toggle();


  }

  triggerFalseClick() {
    let el: HTMLElement = this.myDEAL.nativeElement;
    el.click();
  }

  onHoverOnDealList(id) {
    this.dealselected = id;
  }

  purchaseDeal(promotion: Promotion) {
    this.promotionResolverService.openPromotion(promotion, this.currentSetting.currentCountryId);
  }

  // closeDealDialog() {
  //   this.renderer.setStyle(this.dealDropdown.nativeElement, 'display', 'none')
  // }

  viewRates(event, countryId) {
    if (event.isUserInput) {
     // alert(countryId);



 if(this.currentSetting.currentCountryId != 3 )
{
      localStorage.setItem('rate_country_id', countryId);
      localStorage.setItem('history_search_country_id', countryId);
      this.router.navigate(['globalcallrates']);
}
else
 {
   localStorage.removeItem('rate_country_id');
      this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
        (data: any) =>
        {
          if (this.dialog.openDialogs.length == 0)
          {
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

  displayFn(country?: any): string | undefined
  {
    return country ? country.CountryName : undefined;
  }

  closeFlagDropDown() {
    this.showDropdown = false;
  }

onClickClose(icon)
{
    if (icon == '../assets/images/cross8.png') {
      this.searchicon = '../assets/images/search8.svg';
    }
    this.showDropdown = false;
}



  openFlagDropDown()
  {
    
   if(!this.IsEnableloggedIn) 
   {
    if (this.showDropdown) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
   }
   else
   {
    
    this.snackbar._openSnackBar("You're currently logged in. In order to change your calling country, Please log out and try again.","error");
   }
    
  }


  onSelectCountrFrom(country: Country)
  {
    this.currentSetting.country = country;
    this.razaEnvService.setCurrentSetting(this.currentSetting);
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

      //this.router.navigate(['./searchrates']);
  }


  @HostListener('window:scroll', ['$event'])
  checkScroll()
  {
    const scrollPosition = window.pageYOffset

    if (this.isFixHeader || scrollPosition > 5) {
      this.headerValue = 2;
    }
    else
    {
      this.headerValue = 1;
     // document.getElementById('strip').classList.remove('show');
     // document.getElementById('strip').classList.add('d-none');
    }
    this.setMobileHeader();
  }

  onWindowScroll() {
    if (document.body.scrollTop > 5 ||
    document.documentElement.scrollTop > 5) {


    }
    const scrollPosition = window.pageYOffset

    if (this.isFixHeader || scrollPosition > 5) {
      this.headerValue = 2;
      document.getElementById('hd-bg').classList.remove('header-top');
    }
    this.setMobileHeader();
  }



  status: boolean = false;
  closeStrip(){
      this.status = !this.status;
  }
  opentraans(){
    this.frameborder = (this.frameborder==true)?false:true;
  }

  setPrice = (obj:number) =>{

    return obj;
  }

  goTomobileTopup()
  {
    if(this.authService.isAuthenticated())
    {
      this.router.navigate(['/account/international-topup']);
    }
    else{
      localStorage.removeItem("topupCountry");
      localStorage.removeItem("topupPhone");
      localStorage.removeItem("topupCountryId");
      localStorage.removeItem("topupTrigger");
      this.router.navigateByUrl('mobiletopup');
    }

  }

  clickMenu()
  {
   this.navClick = (this.navClick == '')?'hide_nav':'';
   this.razaLayoutService.setSharedValue(this.navClick);

  }
 // setSharedValue
 get IsEnableloggedIn(): boolean {
  if (!this.authService.isAuthenticated()) {
    return false;
  }
  return true;
}
}
