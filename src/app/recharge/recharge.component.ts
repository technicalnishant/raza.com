import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
 
 
import { TransactionRequest, TransactionType } from 'app/payments/models/transaction-request.model';
import { TransactionService } from 'app/payments/services/transaction.service';
import { PaymentService } from 'app/accounts/services/payment.service';
import { CardinalPaymentService } from 'app/payments/services/cardinal-payment.service';
import { Plan } from 'app/accounts/models/plan';
import { RechargeOptionsModel } from './models/recharge-options.model';
import { RechargeCheckoutModel, ICheckoutModel } from 'app/checkout/models/checkout-model';
import { CheckoutService } from 'app/checkout/services/checkout.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { RazaLayoutService } from 'app/core/services/raza-layout.service';

import { LoginpopupComponent } from 'app/core/loginpopup/loginpopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SearchRatesService } from 'app/rates/searchrates.service'; 
import { ApiErrorResponse } from 'app/core/models/ApiErrorResponse';
import { MatButtonModule } from '@angular/material/button';
 
import { PlanService } from 'app/accounts/services/planService';
import { RechargeService } from './services/recharge.Service';
import { BonusMinutesComponent } from './pages/bonus-minutes/bonus-minutes.component';
 

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})

export class RechargeComponent implements OnInit {
  id: any;
  callingFrom: number;
  callingTo: number;
  RatePerMinWithOutPromo:number;
  isPremium:boolean=false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchRatesService: SearchRatesService,
    private titleService: Title,
    private rechargeService: RechargeService,
    private planService: PlanService,
    private checkoutService: CheckoutService,
    private razaLayoutService: RazaLayoutService,
    public dialog: MatDialog,
  ) {

  }

  planId: string
  rechargeAmounts: number[];
  plan: Plan;
  isAutoRefillEnable: boolean = false;
  selectedPrice : number=10;
  ngOnInit() {
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
           this.getRates()
            this.isPremium = true;
           //this.getRechargeOption()
            //this.isPremium = false;
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
		   // this.getCustomRechargeOption();

      }
    )
  }
  getRates()
  {
    
    this.searchRatesService.getSearchGlobalRates(this.callingFrom, this.callingTo).subscribe(
      (data: any) => {
        this.RatePerMinWithOutPromo = data.WithoutAutorefillPlans.RatePerMin
        if(data.DiscountedPlans.Denominations)
        {
          var j=0;
          var wdata_arr = {};
        var wmulti_data_arr = [];
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
           if( i+1 == data.DiscountedPlans.Denominations.length)
            {
              this.rechargeAmounts = wmulti_data_arr;
            }    
            
                     
         }
          
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
	model.offerPercentage =  '';
    this.checkoutService.setCurrentCart(model);
    this.router.navigate(['/checkout/payment-info']);
  }

  selectAmount(id: any) {
    this.id = id;
  }

  openDialog() {
    const dialogRef = this.dialog.open(BonusMinutesComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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

}


