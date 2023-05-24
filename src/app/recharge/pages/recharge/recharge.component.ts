import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PlanService } from '../../../accounts/services/planService';
import { RechargeService } from '../../services/recharge.Service';
import { TransactionRequest, TransactionType } from '../../../payments/models/transaction-request.model';
import { TransactionService } from '../../../payments/services/transaction.service';
import { PaymentService } from '../../../accounts/services/payment.service';
import { CardinalPaymentService } from '../../../payments/services/cardinal-payment.service';
import { Plan } from '../../../accounts/models/plan';
import { RechargeOptionsModel } from '../../models/recharge-options.model';
import { RechargeCheckoutModel, ICheckoutModel } from '../../../checkout/models/checkout-model';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';

import { LoginpopupComponent } from '../../../core/loginpopup/loginpopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SearchRatesService } from '../../../rates/searchrates.service'; 
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { MatButtonModule } from '@angular/material/button';
import { BonusMinutesComponent } from '../bonus-minutes/bonus-minutes.component';
import { Ratedenominations } from '../../../globalrates/model/ratedenominations';

import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { GlobalPlansData } from '../../../globalrates/model/globalPlansData';
import { NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { CurrentSetting } from '../../../core/models/current-setting';
import { GlobalRatesService } from '../../../home/globalrates.service';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements OnInit {
  isSmallScreen;
  id: any;
  currentSetting: CurrentSetting;
  callingFrom: number;
  callingTo: number;
  RatePerMinWithOutPromo:number;
  isPremium:boolean=false;

  countryCode :any;
        ratesLoaded=false;
        countryName :any;
        countryId:any;
        Plans: Ratedenominations[];
  
  AutorefillPlans: Ratedenominations[];
  WithoutAutorefillPlans: Ratedenominations[];
  sliderPosition :number=2;
  isAutoRefill:boolean=false;
  isAutorefill = false;
  viewAllrate = false;
  viewAllPlan = false;
  is_autorefill = false;
  show_premium = false;
  RatePerMinPromo :any;
    RatePerMin :any=0;
    flag_exists:boolean=false;
    flag_name:string;
    globalPlanData: GlobalPlansData;
    clicked:number=2;
    selectedPrice:number=20;
     
    currenctSetting$: Subscription;

    selectedCountryId:any;
  constructor(
    private router: Router,
    private globalRatesService: GlobalRatesService,
    private route: ActivatedRoute,
    private searchRatesService: SearchRatesService,
    private titleService: Title,
    private rechargeService: RechargeService,
    private planService: PlanService,
    private checkoutService: CheckoutService,
    private razaLayoutService: RazaLayoutService,
    public dialog: MatDialog,
    private razaEnvService: RazaEnvironmentService,
  ) {

  }

  planId: string
  rechargeAmounts: number[];
  rechargeAmountsList: number[];
  plan: Plan;
  isAutoRefillEnable: boolean = false;
  ngOnInit() {

 
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
      this.selectedCountryId = a.country.CountryId;
    });


    this.titleService.setTitle('Select recharge amount');
    this.razaLayoutService.setFixedHeader(true);
    this.planId = this.route.snapshot.paramMap.get('planId');
    // alert(this.planId+"Hello");
    this.planService.getPlan(this.planId).subscribe(
      (res: Plan) =>{
        this.plan = res;
        this.callingFrom = this.plan.CountryFrom;
        this.callingTo = this.plan.CountryTo;

      },
      err => console.log(err),
      () => {
        
        if(this.callingFrom  == 1 || this.callingFrom == 2)
        {
          if(this.plan.CardName == 'CANADA SUPER ONE TOUCH DIAL' || this.plan.CardName == 'SUPER ONE TOUCH DIAL' || this.plan.CardName == 'ONE TOUCH DIAL' || this.plan.CardName == 'CANADA ONE TOUCH DIAL')
          {
           //this.getRates()
          // this.isPremium = true;
           this.getRechargeOption()
            this.isPremium = false;
          }
          else{
            this.getRechargeOption()
            this.isPremium = false;
          }
          
          
          
        }
        else{
          this.getRechargeOption()
          this.isPremium = false;
        }
        
      }
    );
  }

  getRechargeOption() {
    this.rechargeService.getRechargeAmounts(this.plan.CardId).subscribe(
      (res: number[]) => {
        this.rechargeAmounts = res;
        this.rechargeAmountsList = res;
        if(res[0] && res.length >=4)
        {
          /************ To show new reate page enable this page uncomment this ***********/
          this.show_premium = true
          this.getRates()

        }

		   // this.getCustomRechargeOption();
       

      }
    )
  }

   checkAvailability1(arr, val) {
    var exist = false;
    if(arr[0])
    {
      for(var i=0; i<arr.length; i++)
      {
       // console.log(arr[i]);
        if(arr[i].Price == val)
        {
          exist = true;
        }
      }
    }
    return exist;
   /* return arr.some(function(arrVal) {
      return val === arrVal;
    });*/
  }
  checkAvailability(arr, val) {
    var exist = false;
    if(arr[0])
    {
      for(var i=0; i<arr.length; i++)
      {
       // console.log(arr[i]);
        if(arr[i].Price == val)
        {
          exist = true;
        }
      }
    }
    return exist;
    
  }
  getplanbyprice(arr, val, obj) {
    var plan =  
    {
      'id' : 'slide_'+val,
      "SubCardId": "",
      "Price": val,
      "ServiceCharge": 0,
      "Priority": 1,
      "TotalTime": 0,
      "DiscountApplied": 0,
      "DiscountType": "0",
      "PromoMinutes": 0,
      "PromoCode": obj
  }
    
      for(var i=0; i<arr.length; i++)
      {
       // console.log(arr[i]);
        if(arr[i].Price == val)
        {
          
          plan =  
          {
            'id' : 'slide_'+val,
            "SubCardId": arr[i].SubCardId,
            "Price": val,
            "ServiceCharge": arr[i].ServiceCharge,
            "Priority":arr[i].Priority,
            "TotalTime": arr[i].TotalTime,
            "DiscountApplied": arr[i].DiscountApplied,
            "DiscountType": arr[i].DiscountType,
            "PromoMinutes": arr[i].PromoMinutes,
            "PromoCode": arr[i].PromoCode
        }
        }
      }
     
    return plan;
    
  }

  clickSliderButton(current_position)
  {
    setTimeout(()=>{  
      //console.log("current slider is "+current_position);
    let element:HTMLElement = document.getElementById('class_box_'+current_position) as HTMLElement;
    element.click();
    }, 100);
  }
  setPlanType(obj)
  {
    var current_position = this.sliderPosition;
     
    this.isAutoRefill = obj;
    if(obj == true)
    {
      this.is_autorefill = true;
      this.Plans = this.AutorefillPlans;
      this.RatePerMinPromo = this.RatePerMin;
    }
    else{
      this.Plans = this.WithoutAutorefillPlans;
      this.is_autorefill = false;
      this.RatePerMinPromo = this.RatePerMinWithOutPromo;
    }
    this.clickSliderButton(current_position)
  }


  getRates()
  {
    
    this.searchRatesService.getSearchGlobalRates(this.callingFrom, this.callingTo).subscribe(
      (data: any) => {
        this.RatePerMinWithOutPromo = data.WithoutAutorefillPlans.RatePerMin;

        
        this.ratesLoaded = true;
        this.countryCode = data.CountryCode;
        this.countryId = data.ParentCountryId;
        this.countryName = data.ParentCountryName;
        //this.Plans = data.DiscountedPlans.Denominations;
        this.getcountryName();

        this.fileExists();
        this.getFlagName();

        this.RatePerMinPromo = data.DiscountedPlans.RatePerMin;
        this.RatePerMin = this.RatePerMinPromo;
        this.RatePerMinWithOutPromo = data.WithoutAutorefillPlans.RatePerMin;
        this.globalPlanData = data;
        var data_arr = {};
        var multi_data_arr = [];
        var j=0;
        var wdata_arr = {};
        var wmulti_data_arr = [];
      
        if(data.DiscountedPlansWithAutoRefill.Denominations)
        {
          var withoutAfilPlan = data.DiscountedPlansWithAutoRefill.Denominations;
          for(var r = 0; r <this.rechargeAmountsList.length; r++)
          {
               data_arr = this.getplanbyprice(withoutAfilPlan, this.rechargeAmountsList[r], "AUTOREFILL");
             //this.AutorefillPlans.push(data_arr);
             multi_data_arr[r] = data_arr;
             data_arr = {};
            if( r+1 == this.rechargeAmountsList.length)
            {
              this.AutorefillPlans = multi_data_arr
             
            } 
          }
/*
          var j=0;
          for(var i=data.DiscountedPlansWithAutoRefill.Denominations.length-1; i>=0; i--)
          //for(var i=0; i<data.DiscountedPlansWithAutoRefill.Denominations.length; i++)
          {
            if(this.checkAvailability(this.rechargeAmountsList, data.DiscountedPlansWithAutoRefill.Denominations[i].Price))
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
            }
            else
            {
                data_arr['id']= 'slide_'+data.DiscountedPlansWithAutoRefill.Denominations[i].Price;
                data_arr['DiscountApplied'] = 0;
                data_arr['DiscountType']  = '';
                data_arr['Price'] = data.DiscountedPlansWithAutoRefill.Denominations[i].Price;
                data_arr['Priority'] = '';
                data_arr['PromoCode'] = '';
                data_arr['PromoMinutes'] = 0;
                data_arr['ServiceCharge'] = data.DiscountedPlansWithAutoRefill.Denominations[i].ServiceCharge;
                data_arr['SubCardId'] = data.DiscountedPlansWithAutoRefill.Denominations[i].SubCardId;
                data_arr['TotalTime'] = data.DiscountedPlansWithAutoRefill.Denominations[i].TotalTime;
            }
           
            //this.AutorefillPlans.push(data_arr);
             multi_data_arr[j] = data_arr;
             j++;
             data_arr = {};
            if( i+1 == data.DiscountedPlansWithAutoRefill.Denominations.length)
            {
              this.AutorefillPlans = multi_data_arr
              this.Plans = this.AutorefillPlans;
            }           
                      
          }*/
       } 


        if(data.DiscountedPlans.Denominations)
        {
          var j=0;
          var wdata_arr = {};
          var wmulti_data_arr = [];
          var withoutAfilPlan = data.DiscountedPlans.Denominations;
          for(var r = 0; r <this.rechargeAmountsList.length; r++)
          {
            wdata_arr = this.getplanbyprice(withoutAfilPlan, this.rechargeAmountsList[r], "AUTOREFILL");
               wmulti_data_arr[r] = wdata_arr;
             
               wdata_arr = {};
               if( r+1 == this.rechargeAmountsList.length)
                {
                 
                  this.WithoutAutorefillPlans = wmulti_data_arr;
                  this.Plans = this.WithoutAutorefillPlans;
                } 
          }
       /*
        for(var i=data.DiscountedPlans.Denominations.length-1; i>=0; i--)
         {
          
          var secondArray = data.DiscountedPlans.Denominations[i];
          
           
           
            if(this.checkAvailability(this.rechargeAmountsList, data.DiscountedPlans.Denominations[i].Price))
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
              
            }
           else
           {
              wdata_arr['id'] = 'slidew_'+data.DiscountedPlans.Denominations[i].Price;
              wdata_arr['DiscountApplied'] = 0;
              wdata_arr['DiscountType']  = ''
              wdata_arr['Price'] = data.DiscountedPlans.Denominations[i].Price;
              wdata_arr['Priority'] = '';
              wdata_arr['PromoCode'] = '';
              wdata_arr['PromoMinutes'] = 0;
              wdata_arr['ServiceCharge'] = 0;
              wdata_arr['SubCardId'] = data.DiscountedPlans.Denominations[i].SubCardId;
              wdata_arr['TotalTime'] = data.DiscountedPlans.Denominations[i].TotalTime;
           }
          //var result = this.rechargeAmountsList.filter(o => secondArray.some(Price => o === Price));
         // console.log(this.checkAvailability(this.rechargeAmountsList, secondArray.Price))
         

           
           wmulti_data_arr[j] = wdata_arr;
           j++;
           wdata_arr = {};
           if( i+1 == data.DiscountedPlans.Denominations.length)
            {
              //this.rechargeAmounts = wmulti_data_arr;
              this.WithoutAutorefillPlans = wmulti_data_arr;
            }    
            
                     
         }*/
          
        } 
       var i = 0;
       },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  toFixed(num) {
    
  return Math.floor(num*10)/10;
   //return ( num * 10  / 10 ).toFixed(1)
  }

  getRatePerMin(item)
  {
    return this.toFixed((item.Price/(item.TotalTime+item.PromoMinutes))*100)
  }
  
  getCustomRechargeOption() {
    this.rechargeService.getCustomRechargeAmounts(this.plan.CardId).subscribe(
      (res: number[]) => {
        this.rechargeAmounts = res;
      }
    )
  }
  onClickAmountOption1(item: any) {
    const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    model.purchaseAmount = item.Price;
    model.couponCode = item.PromoCode;
    model.currencyCode = this.plan.CurrencyCode;
    model.cvv = '';
    model.planId = this.plan.PlanId
    model.transactiontype = TransactionType.Recharge;
    model.serviceChargePercentage = this.plan.ServiceChargePercent;
    model.planName = this.plan.CardName;
    model.countryFrom = this.plan.CountryFrom;
    model.countryTo = this.plan.CountryTo;
    model.cardId = this.plan.CardId;
    model.isAutoRefill = this.isAutoRefillEnable;
    model.offerPercentage = '';
    this.checkoutService.setCurrentCart(model);
    this.router.navigate(['/checkout/payment-info']);
  }

  onClickAmountOption(amount: number) {
    const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    model.purchaseAmount = amount;
    model.couponCode = '';
    model.currencyCode = this.plan.CurrencyCode;
    model.cvv = '';
    model.planId = this.plan.PlanId
    model.transactiontype = TransactionType.Recharge;
    model.serviceChargePercentage = this.plan.ServiceChargePercent;
    model.planName = this.plan.CardName;
    model.countryFrom = this.plan.CountryFrom;
    model.countryTo = this.plan.CountryTo;
    model.cardId = this.plan.CardId;
    model.isAutoRefill = this.isAutoRefillEnable;
	  model.offerPercentage = '';
    this.checkoutService.setCurrentCart(model);
    this.router.navigate(['/checkout/payment-info']);
  }

  selectAmount(id: any) {
    this.id = id;
  }

  openDialog() {
    const dialogRef = this.dialog.open(BonusMinutesComponent);

    dialogRef.afterClosed().subscribe(result => {
     // console.log(`Dialog result: ${result}`);
    });
  }

  currentUrl: any;
  fragment: string;

  activeSlides: SlidesOutputData;

  customOptions: OwlOptions = {
    items: 2,
    loop: false,
    center: true,
    margin: 16,
    autoWidth: true,
    nav: false,
    dots : false,
    startPosition:this.sliderPosition,
   // startPosition:"2",

   
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
      return 'selected active';
    }
    else{
      return '';
    }
  }
  carouselChanged(evt: SlidesOutputData) {
   // console.log(evt);
  }

 
  onClickRateTab(item: Ratedenominations) {
   /* const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();
    localStorage.setItem('promo', 'Free '+item.DiscountApplied.toString()+'%');
    model.CardId = this.globalPlanData.CardId;
    model.CardName = this.globalPlanData.CardName;
    model.CurrencyCode = this.globalPlanData.CurrencyCode;
    model.details = item;
    model.country = null;
    model.phoneNumber = null;
    //model.countryFrom = this.currentSetting.currentCountryId;
    model.countryFrom = this.callingFrom;
    
    model.countryTo = this.countryId;
    model.couponCode = item.PromoCode;
    model.currencyCode = this.globalPlanData.CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    model.isHideCouponEdit = true;
    //     model.phoneNumber = ''; 
    model.transactiontype = TransactionType.Sale;
    model.isAutoRefill = this.is_autorefill;
    this.checkoutService.setCurrentCart(model);
    this.router.navigate(['/checkout/payment-info']);
       
     */
    if(item.DiscountApplied > 0)
    localStorage.setItem('promo', 'Free '+item.DiscountApplied.toString()+'%');
    else{
       
      localStorage.setItem('promo', 'N/A' );
    }
   const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    model.purchaseAmount = item.Price;
    model.couponCode = item.PromoCode;
    model.currencyCode = this.plan.CurrencyCode;
    model.cvv = '';
    model.planId = this.plan.PlanId
    model.transactiontype = TransactionType.Recharge;
    model.serviceChargePercentage = this.plan.ServiceChargePercent;
    model.planName = this.plan.CardName;
    model.countryFrom = this.plan.CountryFrom;
    model.countryTo = this.plan.CountryTo;
    model.cardId = this.plan.CardId;
    model.isAutoRefill = this.is_autorefill;
	model.offerPercentage = '';
    this.checkoutService.setCurrentCart(model);
    this.router.navigate(['/checkout/payment-info']);

  }
  


  getcountryName(){
    var string_name = '';
    if(this.countryName && this.countryName !=''){
      string_name =  this.countryName.toLowerCase();
  }
//  console.log("Hello Aj you are here "+string_name);
    return string_name.replace(' ', '-');
  }
  fileExists()
  {
   var site_url = location.origin;
    
   var string_name = '';
     if(this.countryName && this.countryName !=''){
       string_name =  this.countryName.toLowerCase();
   }
      string_name.replace(' ', '-');
     
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

 setActiveClass(obj)
 {
   this.selectedPrice = obj.Price;
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
 /******** EOF ********/
}


