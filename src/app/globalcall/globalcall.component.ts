import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Inject, OnDestroy, ViewChild, ElementRef,ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RazaLayoutService } from 'app/core/services/raza-layout.service';
import { CallUsComponent } from 'app/shared/dialog/call-us/call-us.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { SearchRatesService } from '../rates/searchrates.service'; 
import { GlobalCallComponent } from '../globalrates/global-call/global-call.component';
import { GlobalRatesService } from '../home/globalrates.service';
import { CurrentSetting } from '../core/models/current-setting';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import {  Observable, of, Subscription } from 'rxjs';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { Ratedenominations } from '../globalrates/model/ratedenominations';
import { GlobalSubPlans } from '../globalrates/model/globalSubPlans';
import { GlobalPlansData } from '../globalrates/model/globalPlansData';
import { FormControl } from '@angular/forms';
import { NewPlanCheckoutModel } from '../checkout/models/checkout-model';
import { TransactionType } from '../payments/models/transaction-request.model';
import { AuthenticationService } from '../core/services/auth.service';
import { CheckoutService } from '../checkout/services/checkout.service';
 

import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { filter, map, startWith, tap } from '../../../node_modules/rxjs/operators';
import { Country } from '../rates/model/country';
import { MetaTagsService } from 'app/core/services/meta.service';

import { Title, Meta } from '@angular/platform-browser';

import { Location } from '@angular/common';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-globalcall',
  templateUrl: './globalcall.component.html',
  styleUrls: ['./globalcall.component.scss'],
   
})
export class GlobalcallComponent implements OnInit {
  isSmallScreen;
  countryId:any;
  currentSetting: CurrentSetting;
  currentSetting$: Subscription;
  isSticky: boolean = false;

    countryCode :any;
    
    countryName :any;
   
     
    RatePerMinPromo :any;
    RatePerMin :any;
    RatePerMinWithOutPromo :any;
     
     
    auto_refill_plan:any=[];
    regurlaPlan:any=[];
    isAutoRefill:boolean=false;


    flag_exists:boolean=false;
    flag_name:string;
 
 
  SubPlans: GlobalSubPlans[] = [];
  FilteredSubPlans: GlobalSubPlans[] = [];
  Plans: Ratedenominations[];
  
  AutorefillPlans: Ratedenominations[];
  WithoutAutorefillPlans: Ratedenominations[];
  isAutorefill = false;
  viewAllrate = false;
  viewAllPlan = false;
  auto_data_arr : any = {  

    id:'',
  Price: undefined,
  Priority: undefined,
  ServiceCharge: undefined,
  SubCardId: undefined,
  TotalTime: undefined,
  DiscountApplied:undefined,
  DiscountType:undefined,
  PromoMinutes: undefined,
  PromoCode: undefined

  };
  headerValue: number = 1;
  blueBg:number=0;
  globalPlanData: GlobalPlansData;
 
  currenctSetting$: Subscription;

  denominationList: any[];
  allCountry: Country[];
  carouselData: any[]; 
  ratesLoaded=false;
  filteredCountry: Country[];
  filteredCountryList: Observable<any[]>;
  is_autorefill:boolean=false;
  wauto_data_arr: any = {  
    id:'',
    Price: undefined,
    Priority: undefined,
    ServiceCharge: undefined,
    SubCardId: undefined,
    TotalTime: undefined,
    DiscountApplied:undefined,
    DiscountType:undefined,
    PromoMinutes: undefined,
    PromoCode: undefined
  };

  sliderPosition :number=0;
  selectedPrice : number=20;

  baseCountryId:string = '';
  baseCountryName:string = '';
  showMore:boolean=false;
  showButton:boolean=true;
  showDropdown:boolean=false
  denominationSelectControl: FormControl = new FormControl();
  serchdata: any; autoControl = new FormControl(); allCountryList: any[];
  searchicon: string = '../assets/images/search8.svg';
  showPlaceholder: boolean = true;
  bottom_scroll:any;
  @ViewChild('matContent',{static: true}) matContent: ElementRef;
  sticky_class:any='';
  constructor(
    public dialog: MatDialog,
    private razalayoutService: RazaLayoutService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private searchRatesService: SearchRatesService,
    private globalRatesService: GlobalRatesService,
    private razaEnvService: RazaEnvironmentService,
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
    private metaTagsService:MetaTagsService,
    private _titleService: Title,
    private _metaService: Meta,
    private location: Location
    ) { 

    
    
    }

 
    
  ngOnInit(): void {

    this.razalayoutService.setFixedHeader(true);
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
  
    this.searchRatesService.getAllCountries().subscribe(
      (data: Country[]) => {
        if(data)
        {
        this.allCountry = data;
      }
      },
      (err: ApiErrorResponse) => console.log(err),
    );

    if(this.route.snapshot.paramMap.get('country_name'))
    {
      let current_route = this.route.snapshot.paramMap.get('country_name')
      let country_name = this.route.snapshot.paramMap.get('country_name');
      if(current_route.includes('how_to_call_'))
      {
       var cntr_arr = current_route.split("how_to_call_");
        country_name = cntr_arr[1].replace(/_/g, " ");

       //  country_name = this.route.snapshot.paramMap.get('country_name');
      }

      if(current_route.includes('cheap_calls_to_'))
      {
       var cntr_arr = current_route.split("cheap_calls_to_");
        country_name = cntr_arr[1].replace(/_/g, " ");

       //  country_name = this.route.snapshot.paramMap.get('country_name');
      }
      country_name = country_name.charAt(0).toUpperCase() + country_name.slice(1);
      this._titleService.setTitle('Cheap calls to '+country_name+' - Raza.com'); 
      this._metaService.addTags([{ "name": "description",
          "content": 'Low-cost international calling cards to '+country_name+' from Raza.com. Get cheap rates to call your friends and family in '+country_name+' today!'
      }])
      // Title: 

      // Meta Description: 

      this.filteredCountry = this._filter(country_name);
      if(this.filteredCountry[0])
      {
          this.countryId = this.filteredCountry[0].CountryId;
          this.getRates();
      }
    
    }
    
    else{
      this.metaTagsService.getMetaTagsData('globalcallrates');
      this.countryId = localStorage.getItem('rate_country_id');
    }

   

    //this.countryId = this.route.snapshot.queryParams['country_id'];
   // this.route.snapshot.paramMap.get('country_id');
    
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      //this.getActivePromotion(this.currentSetting.currentCountryId);
    })

    if( this.countryId != '')
    {
      this.getRates();
    }
    else
    {
      this.router.navigate(['/']);
    }

    document.getElementById('hd-bg').classList.remove('header-top');
    
     if(window.screen.width > 768)
     {
      this.headerValue = 2;
      this.blueBg = 0;
     }
     else
     {
      this.blueBg = 1;
      this.headerValue = 1;
     }
     

    window.scroll({
      top: 2,
     
      behavior: 'smooth'
    });

  this.viewAllRatesTab()

    this.filteredCountryList = this.autoControl.valueChanges
    .pipe(
      startWith<string | any>(''),
      map(value => typeof value === 'string' ? value : value.CountryName),
      map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
    );

  }
  
  private _filter(value: any): Country[] {
    console.log('value is ', value)
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }


  

  clickSliderButton(current_position)
  {
    setTimeout(()=>{  
      console.log("current slider is "+current_position);
    let element:HTMLElement = document.getElementById('class_box_'+current_position) as HTMLElement;
    element.click();
    }, 100);
  }
  setPlanType()
  {
    var current_position = this.sliderPosition;
     
    this.isAutoRefill = !this.isAutoRefill;
    if(this.isAutoRefill == true)
    {
      this.is_autorefill = true;
      this.Plans = this.AutorefillPlans;
    }
    else{
      this.Plans = this.WithoutAutorefillPlans;
      this.is_autorefill = false;
    }
    this.clickSliderButton(current_position)
  }
 

  toFixed(num) {
    /*fixed = fixed || 0;
    fixed = Math.pow(10, fixed);
    return Math.floor(num * fixed) / fixed;
  */
  //console.log(num);
  return Math.floor(num*10)/10;
   //return ( num * 10  / 10 ).toFixed(1)
  }

  getToFixedTrunc(x:any) 
  {
      let n = 2;
      const v = (typeof x === 'string' ? x : x.toString()).split('.');
       
      if (n <= 0) return v[0];
      let f = v[1] || '';
      if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
      while (f.length < n) f += '0';
      return `${v[0]}.${f}`
  }
  toFixed1(num) {
    // num = Math.round(num)
   // console.log(num);
   let amt = this.getToFixedTrunc(num) ;
  amt = amt.toString().split('.');
  let slice_amt = amt[1].slice(-1)
  let num_amt = parseFloat(slice_amt)
      if( num_amt > 5)
      {
       // console.log(num_amt);
        //amt[1] =  parseFloat(amt[1])+ (10 - num_amt);
        //amt[0] = amt[0]+1;
      }
      
     return this.toFixed(amt[0]+"."+amt[1]);

  }

  setAutrefillDenomination()
  {
    var j=0;
    for(var i=0; i<this.AutorefillPlans.length; i++)
    {
      var price = this.AutorefillPlans[i].Price; 
      var regularTime = this.WithoutAutorefillPlans[i].TotalTime;
      var TotalTime = this.AutorefillPlans[i].TotalTime; 
      var discount_min = TotalTime-regularTime;
      var discount_pct = 10;
      var per_cent  = this.toFixed((price/TotalTime)*100);
      if(price == 90)
      {
        per_cent = this.RatePerMinPromo;
        discount_pct = 20;
      }
     
      
      var denonm_arr = {
        SubCardId: this.AutorefillPlans[i].SubCardId, 
        Price: price, 
        ServiceCharge: this.AutorefillPlans[i].ServiceCharge, 
        Priority: this.AutorefillPlans[i].Priority, 
   
        regularTime:regularTime, 
        TotalTime:TotalTime, 
        discount_min:discount_min, 
        discount_pct:discount_pct,
        per_cent:per_cent }
 
        this.auto_refill_plan.push(denonm_arr);
      
    }
  }

  setRegularDenomination()
  {
    var j=0;
    for(var i=0; i<this.WithoutAutorefillPlans.length; i++)
    {
      var discount_pct = 10;
      var price = this.WithoutAutorefillPlans[i].Price; 
      var regularTime = this.WithoutAutorefillPlans[i].TotalTime;
      
        if(price == 90)
        discount_pct = 5;
        if(price == 50)
        discount_pct = 10;

        if(price == 20)
        discount_pct = 7;

        if(price == 10)
        discount_pct = 5;

      var discount_min = regularTime*discount_pct/100;
      var TotalTime = regularTime+discount_min; 
    
     
      var per_cent  = this.toFixed((price/TotalTime)*100);

      if(price == 90)
      {
        
        discount_pct = 15;
      }
      
      var denonm_arr = {
        SubCardId: this.WithoutAutorefillPlans[i].SubCardId, 
        Price: price, 
        ServiceCharge: this.WithoutAutorefillPlans[i].ServiceCharge, 
        Priority: this.WithoutAutorefillPlans[i].Priority, 
        regularTime:regularTime, 
        TotalTime:TotalTime, 
        discount_min:discount_min, 
        discount_pct:discount_pct,
        per_cent:per_cent }
 
        this.regurlaPlan.push(denonm_arr);
      
    }
  }

  getRatePerMin(item)
  {
   //console.log (item.Price, item.TotalTime, item.PromoMinutes)
    return this.toFixed1((item.Price/(item.TotalTime+item.PromoMinutes))*100)
   // return (item.Price/(item.TotalTime+item.PromoMinutes))*100
  }

  getTotalMin(min, promomin, price)
  {
    if(!this.isAutoRefill)
    {
     var item:any = this.WithoutAutorefillPlans.filter(a => a.Price == price);
    //  console.log('item is ', item)
     
     return Math.floor(min+ (min* item[0].DiscountApplied)/100);
    }
    else
    {
      var item:any = this.AutorefillPlans.filter(a => a.Price == price);
      return Math.floor(min+ (min* item[0].DiscountApplied)/100);
      //return Math.floor( min+promomin)
    }
  }
 getFlagName()
 {
  this.flag_name = '';
  var cntr = this.countryName;
  let x = cntr.split(" ");
 
  for(var i=0; i<x.length; i++)
  {
    this.flag_name= this.flag_name+x[i].charAt(0);
 
  }
   
 } 


  fileExists()
   {
    var site_url = location.origin;
     
    var string_name = '';
      if(this.countryName && this.countryName !=''){
        string_name =  this.countryName.toLowerCase();
        
    }
      // string_name.replace(' ', '-');
       string_name= string_name.replace(/ /g, "")
       console.log('Your country name is ',string_name );

    var url = site_url+'/assets/images/flag/'+string_name+'.png';
    //var file_exist = this.globalRatesService.fileExists(url);
    const image = {
      url: url,
      context: 'Raza'
    }
    this.globalRatesService.getImageDimension(image).subscribe(
       response => { 
          if(response.width > 0)
          {
            this.flag_exists = true;
          }
          else{
            this.flag_exists = false;
            
          }
       }
    );
  }

  viewRates(event, countryId)
  {
    this.countryId = countryId;
    this.getRates()
    this.viewAllRatesTab()
  }

  getRates()
  {
    this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, this.countryId).subscribe(
      (data: any) => {
         
        this.ratesLoaded = true;
        this.countryCode = data.CountryCode;
      
        this.baseCountryId = data.CountryId;
        this.baseCountryName = data.CountryName;

        this.countryId = data.ParentCountryId;
        this.countryName = data.ParentCountryName;

        //this.Plans = data.DiscountedPlans.Denominations;
        var data_arr = {};
        
        var multi_data_arr = [];
        this.fileExists();
        this.getFlagName();

       

        
        if(data.DiscountedPlansWithAutoRefill.Denominations)
        {
          var j=0;
          for(var i=data.DiscountedPlansWithAutoRefill.Denominations.length-1; i>=0; i--)
          //for(var i=0; i<data.DiscountedPlansWithAutoRefill.Denominations.length; i++)
          {
            data_arr['id']= 'slide_'+data.DiscountedPlansWithAutoRefill.Denominations[i].Price;
             data_arr['DiscountApplied'] = data.DiscountedPlansWithAutoRefill.Denominations[i].DiscountApplied;
            data_arr['DiscountType']  = data.DiscountedPlansWithAutoRefill.Denominations[i].DiscountType;
            data_arr['Price'] = data.DiscountedPlansWithAutoRefill.Denominations[i].Price;
            data_arr['Priority'] = data.DiscountedPlansWithAutoRefill.Denominations[i].Priority;
            data_arr['PromoCode'] = data.DiscountedPlansWithAutoRefill.Denominations[i].PromoCode;
            data_arr['PromoMinutes'] = data.DiscountedPlansWithAutoRefill.Denominations[i].PromoMinutes;
            data_arr['ServiceCharge'] = data.DiscountedPlansWithAutoRefill.Denominations[i].ServiceCharge;
            data_arr['SubCardId'] = data.DiscountedPlansWithAutoRefill.Denominations[i].SubCardId;
            data_arr['TotalTime'] = data.DiscountedPlansWithAutoRefill.Denominations[i].TotalTime;

            //this.AutorefillPlans.push(data_arr);
             multi_data_arr[j] = data_arr;
             j++;
             data_arr = {};
            if( j+1 == data.DiscountedPlansWithAutoRefill.Denominations.length)
            {
              this.AutorefillPlans = multi_data_arr.filter(a => a.Price != 90);
               
              this.Plans = this.AutorefillPlans;
            }           
                      
          }
       } 
       var wdata_arr = {};
       var wmulti_data_arr = [];
      
       if(data.DiscountedPlans.Denominations)
       {
         var j=0;
         for(var i=data.DiscountedPlans.Denominations.length-1; i>=0; i--)
         {
           wdata_arr['id'] = 'slidew_'+data.DiscountedPlans.Denominations[i].Price;
           wdata_arr['DiscountApplied'] = data.DiscountedPlans.Denominations[i].DiscountApplied;
           wdata_arr['DiscountType']  = data.DiscountedPlans.Denominations[i].DiscountType;
           wdata_arr['Price'] = data.DiscountedPlans.Denominations[i].Price;
           wdata_arr['Priority'] = data.DiscountedPlans.Denominations[i].Priority;
           wdata_arr['PromoCode'] = data.DiscountedPlans.Denominations[i].PromoCode;
           wdata_arr['PromoMinutes'] = data.DiscountedPlans.Denominations[i].PromoMinutes;
           wdata_arr['ServiceCharge'] = data.DiscountedPlans.Denominations[i].ServiceCharge;
           wdata_arr['SubCardId'] = data.DiscountedPlans.Denominations[i].SubCardId;
           wdata_arr['TotalTime'] = data.DiscountedPlans.Denominations[i].TotalTime;
           wmulti_data_arr[j] = wdata_arr;
           j++;
           wdata_arr = {};
           if( j+1 == data.DiscountedPlans.Denominations.length)
            {
              this.WithoutAutorefillPlans = wmulti_data_arr.filter(a => a.Price != 90)
              //this.WithoutAutorefillPlans = wmulti_data_arr;
            }    
            
                     
         }
      } 
      

 

        this.RatePerMinPromo = data. DiscountedPlansWithAutoRefill.RatePerMin;
        this.RatePerMin = this.RatePerMinPromo;
        this.RatePerMinWithOutPromo = data.DiscountedPlans.RatePerMin;
        //this.WithoutAutorefillPlans = data.DiscountedPlans.Denominations;
        this.globalPlanData = data;
  
       // var plan_arr = {100}
       //this.setAutrefillDenomination();
       //this.setRegularDenomination();
       var i = 0;


      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }
  contactUs() {
    this.dialog.open(CallUsComponent);
  }

  learnmore() {

    localStorage.setItem('countryId', this.countryId.toString());
    this.router.navigateByUrl(`/learnmore?country=${this.countryId}`);
  }

  viewAllRatesTab() {
    this.searchRatesService.getSearchGlobalRatesSubPlans(this.currentSetting.currentCountryId, this.countryId).subscribe(
      (data: any) => {
        this.SubPlans = data
        if (this.SubPlans.length > 0) 
        {
          this.denominationList = Array.from(new Set(this.SubPlans.map(item => item.Price)));
          this.denominationList = this.denominationList.sort( (a, b)=> a-b)
          this.denominationList = this.denominationList.filter(a=> a != 90 )

 
        //  this.denominationSelectControl.setValue(this.denominationList[0]); 
          this.denominationSelectControl.setValue(this.selectedPrice);  
          this.filterDetailRate(this.denominationList[0]);
          this.viewAllrate = true;
         // this.matContent.nativeElement.scrollTop = 500;
        }
        else
          this.viewAllPlan = false;
      }
      , (err: ApiErrorResponse) => console.log(err));
  }
  selectDenomination() 
  {
   // this.filterDetailRate(this.denominationSelectControl.value);
   this.selectedPrice = this.denominationSelectControl.value;
    this.filterDetailRate(this.selectedPrice);
  }
 
  filteredItems(price: number) {
    //this.FilteredSubPlans = this.SubPlans.filter(a => a.Price == price); 
    return this.SubPlans.filter(a => a.Price == price);
  }
  filterDetailRate(price: number) {
    //this.FilteredSubPlans = this.SubPlans.filter(a => a.Price == price); 
    this.FilteredSubPlans = this.SubPlans.filter(a => a.Price == this.selectedPrice);
  }

  getSubbCallRates(item)
  {
    var call_rate = item.CallRate;
    if(item.DiscountedRate)
    {
      call_rate = this.toFixed((item.DiscountedRate.Price/ (item.DiscountedRate.TotalTime + item.DiscountedRate.PromoMinutes)*100));
    }

    return call_rate;

  }
  onClickRateTab(item: Ratedenominations) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();
    localStorage.setItem('promo', 'Free '+item.DiscountApplied.toString()+'%');
    model.CardId = this.globalPlanData.CardId;
    model.CardName = this.globalPlanData.CardName;
    model.CurrencyCode = this.globalPlanData.CurrencyCode;
    model.details = item;
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = this.countryId;
    model.couponCode = item.PromoCode;
    model.currencyCode = this.globalPlanData.CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    model.isHideCouponEdit = true;
    //     model.phoneNumber = ''; 
    model.transactiontype = this.authService.isNewUser() ? TransactionType.Activation : TransactionType.Sale;
    model.isAutoRefill = this.is_autorefill;
    this.checkoutService.setCurrentCart(model);
    console.log(model);
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/checkout/payment-info']);
      } else {
        this.router.navigate(['/checkout']);
      }
     
  }
    //GlobalPlansData
    onClickRateTab1(item: Ratedenominations) 
    {
      const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();
  
      model.CardId = this.globalPlanData.CardId;
      model.CardName = this.globalPlanData.CardName;
      model.CurrencyCode = this.globalPlanData.CurrencyCode;
      model.details = item;
      model.country = null;
      model.phoneNumber = null;
      model.countryFrom = this.currentSetting.currentCountryId;
      model.countryTo = this.countryId;
      model.couponCode = '';
      model.currencyCode = this.globalPlanData.CurrencyCode;
      model.transactiontype = TransactionType.Activation;
      //     model.phoneNumber = ''; 
      model.transactiontype = this.authService.isNewUser() ? TransactionType.Activation : TransactionType.Sale;
      model.isAutoRefill = this.isAutorefill;
      this.checkoutService.setCurrentCart(model);
      localStorage.removeItem('history_search_country_id');
        if (this.authService.isAuthenticated()) {
          this.router.navigate(['/checkout/payment-info']);
        } else {
          this.router.navigate(['/checkout']);
        }
     
    }
    
    buyPlan() {
      const deno: Ratedenominations = this.Plans.find(a => a.Price == this.denominationSelectControl.value);
      this.onClickRateTab(deno);
    }

    scrollToTop() {
     // this.matContent.nativeElement.scrollTop = 0;
    }

    getcountryName(){
      var string_name = '';
      if(this.countryName && this.countryName !=''){
        string_name =  this.countryName.toLowerCase();
    }
    string_name = string_name.replace(/ /g, "")
      return string_name;//.replace(\ \/g, '');
    }
    getcountryId(){
      var string_name =  this.countryId.toLowerCase();
      return string_name.replace(' ', '-');
    }
    currentUrl: any;
    fragment: string;
  
    activeSlides: SlidesOutputData;

    customOptions: OwlOptions = {
      items: 1,
      loop: false,
      center: false,
      margin: 10,
      autoWidth: true,
      nav: false,
      dots : false,
      startPosition:this.sliderPosition,
    }


    getPassedData(data: any) {
      //console.log('getPassedData');
     // console.log(data);
    }
  
    getChangeData(data: any) {
     
    }
  
    getChangedData(data: any) {
      
      
      this.sliderPosition = data.startPosition;
      this.clickSliderButton(this.sliderPosition);

    }
    removeLastSlide() {
     
    }
    getSelected_box(obj:number)
    {
      if((obj) == this.sliderPosition)
      {
        return 'selected active active_li';
      }
      else{
        return '';
      }
    }
    carouselChanged(evt: SlidesOutputData) {
      console.log(evt);
    }
   
    setActiveClass(obj)
    {
      this.selectedPrice = obj.Price;
      this.denominationSelectControl.setValue(this.selectedPrice); 
      this.filterDetailRate(this.selectedPrice);
    }
    getActiveClass(obj)
    {
      if((obj.Price) == this.selectedPrice)
      {
        return 'selected_active';
      }
      else{
        return '';
      }
    }
    getNameOfCountry(obj){
      if(obj == this.countryName)
      {
        return obj+' landline'
      }
      else
      return obj;
    }


    getClassIcon(obj)
    {
      if(obj == this.countryName)
      {
        return 'landline_icon';
      }

      else if(obj == this.countryName+' Mobile')
      {
        return 'mobile_icon';
      }
      else
      {
        return '';
      }

    }

    isVisibleFaq(){
      this.showMore = true;
      this.showButton = false;
     }

     openFlagDropDown() {

      if (this.showDropdown) {
        this.showDropdown = false;
      } else {
        this.showDropdown = true;
      }
    }

    onClickInput() {
      this.searchicon = '../assets/images/search8.svg';
    }
    displayFn(country?: any): string | undefined {
      return country ? country.CountryName : undefined;
    }
    onInputFocus() {
      this.searchicon = '../assets/images/cross8.png';
      this.showDropdown = false;
      this.showPlaceholder = false;
    }

    goBack(): void {
      this.location.back();
    }


    @HostListener('window:scroll', ['$event'])
    handleScroll() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.isSticky = scrollPosition >= 100; // Adjust the value based on when you want the div to become sticky
      let scroll:number = scrollPosition
     

      if(scroll >= 300)
      {
       this.bottom_scroll = scroll;
      }
      else
      {
         this.bottom_scroll = 0;
      }


      if(scroll >= 650)
      {
       this.sticky_class = 'activerow_full';
      }
      else{
         this.sticky_class = '';
      }
    
    }
    buyScroll(item){
      
      if(this.bottom_scroll >=300)
      {
        this.onClickRateTab(item);
      }
      
    }

}
