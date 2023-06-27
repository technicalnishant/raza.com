import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit,Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Plan } from 'app/accounts/models/plan';
import { PlanService } from 'app/accounts/services/planService';
import { RechargeCheckoutModel } from 'app/checkout/models/checkout-model';
import { CheckoutService } from 'app/checkout/services/checkout.service';
import { ApiErrorResponse } from 'app/core/models/ApiErrorResponse';
import { CurrentSetting } from 'app/core/models/current-setting';
import { AuthenticationService } from 'app/core/services/auth.service';
import { RazaLayoutService } from 'app/core/services/raza-layout.service';
import { TransactionType } from 'app/payments/models/transaction-request.model';
import { SearchRatesService } from 'app/rates/searchrates.service';

@Component({
  selector: 'app-account-recharge',
  templateUrl: './account-recharge.component.html',
  styleUrls: ['./account-recharge.component.scss']
})
export class AccountRechargeComponent implements OnInit {
  @Input() plan: Plan;
  currentSetting: CurrentSetting;
  phoneNumber:any;
  toCountryId:number;
  fromCountryId:number;
  denominatons:any;
  isAutorefill:boolean=false;


  username: string;
 
	 
	isEnableOtherPlan: boolean = false;
  is_notification: boolean=false;
  sendPushNotification: boolean=false;
  sendSMSPromo: boolean=false;
  uri:string='';
  myModel:boolean=true;
  isSmallScreen: boolean=false;
  showPlan: boolean;
  selectedDenomination:number=10;
  isAutoRefillEnable: boolean;
  ratesLoaded:boolean=false;
  constructor(
    private searchRatesService: SearchRatesService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private razalayoutService: RazaLayoutService,
	private planService: PlanService,
	private authService: AuthenticationService,
  private breakpointObserver: BreakpointObserver,
  private checkoutService: CheckoutService,
  ) { }

  ngOnInit(): void {
    this.phoneNumber    = localStorage.getItem("login_no");
   

    this.titleService.setTitle('Recharge');
    this.razalayoutService.setFixedHeader(true);
    this.uri = this.route.snapshot.paramMap.get('notification');//?this.route.snapshot.paramMap.get('notification'):'notification';
	  this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {
        this.plan = data[0];
        if(data.length > 0 )
        {

          this.toCountryId    = this.plan.CountryTo;
          this.fromCountryId  = this.plan.CountryFrom;
          this.isEnableOtherPlan =false
        }
        else {
			if( this.authService.isNewUser() == true)
			{
				this.isEnableOtherPlan =true;
			}
        }
        this.getRates();
      },
      (err: ApiErrorResponse) => console.log(err)
    );


    
  }
  
  getActiveClass(item)
  {
    return this.selectedDenomination == item.Price?'active':'';
  }
   
    getRates()
    {
      this.searchRatesService.getSpecificRateDetails(this.fromCountryId, this.toCountryId, this.phoneNumber).subscribe(
        (data: any) => {
          if( data )
          this.filterDenomination(data);
           
        })
   }

   filterDenomination(data:any)
   {
      this.denominatons = data[0];//.filter( a => {a.CountryId == this.fromCountryId})
      this.ratesLoaded = true;
      this.setCart()
   }

   setPlanType()
   {
     
     this.isAutorefill = !this.isAutorefill;
     // this.clickSliderButton(current_position)
   }
   setCart()
   {
    this.denominatons.Denominations.map(item=>{
      if(item.Price == this.selectedDenomination){
        this.onClickAmountOption(item);
      }
    })
   }
   onClickAmountOption(item: any)
   {
    this.selectedDenomination=item.Price;
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
    model.isAutoRefill = this.isAutorefill;
    model.offerPercentage = '';
    this.checkoutService.setCurrentCart(model);
    console.log(model);
  }
}
