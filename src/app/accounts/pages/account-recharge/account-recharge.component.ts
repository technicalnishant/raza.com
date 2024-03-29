import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit,Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Plan } from 'app/accounts/models/plan';
import { PlanService } from 'app/accounts/services/planService';
import { ICheckoutModel, NewPlanCheckoutModel, RechargeCheckoutModel } from 'app/checkout/models/checkout-model';
import { CheckoutService } from 'app/checkout/services/checkout.service';
import { ApiErrorResponse } from 'app/core/models/ApiErrorResponse';
import { CurrentSetting } from 'app/core/models/current-setting';
import { AuthenticationService } from 'app/core/services/auth.service';
import { RazaLayoutService } from 'app/core/services/raza-layout.service';
import { TransactionType } from 'app/payments/models/transaction-request.model';
import { SearchRatesService } from 'app/rates/searchrates.service';
import { CreditCard } from '../../models/creditCard';

import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../../../payments/models/planOrderInfo.model';
import { TransactionProcessBraintreeService } from 'app/payments/services/transactionProcessBraintree';
import { TransactionService } from 'app/payments/services/transaction.service';
import { TransactionProcessFacadeService } from 'app/payments/services/transactionProcessFacade';
import { ApiProcessResponse } from 'app/core/models/ApiProcessResponse';
import { BraintreeService } from 'app/payments/services/braintree.service';
import { ValidateCouponCodeRequestModel, ValidateCouponCodeResponseModel } from 'app/payments/models/validate-couponcode-request.model';
import { ErrorDialogModel } from 'app/shared/model/error-dialog.model';
import { ErrorDialogComponent } from 'app/shared/dialog/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { isNullOrUndefined } from "../../../shared/utilities";
import { Subscription, of } from 'rxjs';
import { ViewratesComponent } from 'app/accounts/dialog/viewrates/viewrates.component';
import { RechargeService } from 'app/recharge/services/recharge.Service';
import { IOnApproveCallbackData, IPayPalConfig } from 'app/payments/paypal/model/paypal.model';
import { environment } from 'environments/environment';
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
  //currentCart: ICheckoutModel;
   
  paymentProcessor:any;
  currentCartObs$: Subscription;
  currentCart: ICheckoutModel;
  clientCardId:any;
  selectedAmount:any;
  selectedPlanId:any='';
  
  rechargeAmounts: number[];
  callingFrom: number;
  callingTo: number;
  isPremium:boolean=false;
  showPaypal:boolean=false;
  public payPalConfig?: IPayPalConfig;
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
    private transactionService: TransactionService,
    private transactionProcessFacade: TransactionProcessFacadeService,
    private transactionProcessBraintree: TransactionProcessBraintreeService,
    private braintreeService: BraintreeService,
    private dialog: MatDialog,
    private rechargeService: RechargeService,

  ) {
    
   }

  ngOnInit(): void {

    this.selectedPlanId = this.route.snapshot.paramMap.get('planId');
    this.checkoutService.deleteCart();
    this.selectedDenomination = (history.state.price)?history.state.price:10;
    this.phoneNumber    = localStorage.getItem("login_no");
    this.titleService.setTitle('Recharge');
    this.razalayoutService.setFixedHeader(true);
    this.uri = this.route.snapshot.paramMap.get('notification');//?this.route.snapshot.paramMap.get('notification'):'notification';
    
    if(this.selectedPlanId && this.selectedPlanId !='')
    {
      this.getSelectedPlan()
    }
    else
    {
      this.getDefaultPlan()
    }
    
 }
// Intitiate paypal config
private initPaypalConfig(): void {
 
  if (isNullOrUndefined(this.currentCart)) {
     
    return;
  }

   
  this.payPalConfig = {
    currency: this.currentCart.currencyCode.toString(),
    clientId: environment.paypalClientId,
    createOrderOnServer: () => {
      return this.validateAndGeneratePaypalOrder();
    },
    advanced: {
      updateOrderDetails: {
        commit: true
      },
      extraQueryParams: [
        { name: 'intent', value: 'authorize' },
        { name: 'disable-funding', value: 'credit,card' }
      ]
    },
    onApprove: (data, actions) => {
      // console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        //  console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    authorizeOnServer: (data, actions) => {
      console.log('authorizeOnServer - you should probably inform your server to autorize and capture transaction at this point', data);
      return this.onPaypalPaymentApprove(data);
    },
    // onClientAuthorization: (data) => {
    //     console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    // },
    onCancel: (data, actions) => {
      // console.log('OnCancel', data, actions);

    },
    onError: err => {
      // console.log('OnError', err);
    },
    onClick: () => {
      // console.log('onClick');
    },
  };

   this.showPaypal = true;
}
get enablePaypalOption() {
  if(this.currentCart)
  {
    return this.currentCart.transactiontype != TransactionType.Topup;
  }
  
 }
validateAndGeneratePaypalOrder(): Promise<string> {
  if (!isNullOrUndefined(this.currentCart.couponCode) && this.currentCart.couponCode.length > 0) {
    return this.validateCoupon(this.currentCart.getValidateCouponCodeReqModel(this.currentCart.couponCode)).then((res: ValidateCouponCodeResponseModel) => {
      if (res.Status) {
        return this.transactionService.generatePaypalOrder(this.currentCart.getTransactionReqModel()).toPromise();
      }
      else {
        this.handleInvalidCouponCodeError();
         new Error("Invalid coupon code");
      }
    })
  }
  else {
    return this.transactionService.generatePaypalOrder(this.currentCart.getTransactionReqModel()).toPromise();
  }

}

/* On paypal payment approve. */
onPaypalPaymentApprove(data: IOnApproveCallbackData): Promise<any> {

  const checkOutOrderInfo: IPaypalCheckoutOrderInfo = {
    checkoutCart: this.currentCart,
    orderId: data.orderID,
    paypalPayerId: data.payerID,
    paymentTransactionId: data.orderID
  };

  console.log('paypal checkout order info', checkOutOrderInfo);


  this.transactionProcessFacade.processPaypalTransaction(this.currentCart.transactiontype, checkOutOrderInfo);
  return of(true).toPromise();
}
 
 getDefaultPlan()
 {

  this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe( 
    (res:any)=>{
      if(res !== null && res.CardId )
      {
        this.clientCardId = res.CardId;
        this.isAutoRefillEnable = res.ArStatus
        this.plan = res;
        this.toCountryId    = this.plan.CountryTo;
        this.fromCountryId  = this.plan.CountryFrom;
        this.isEnableOtherPlan =false
        this.isPremium = true;
         
        this.getRates()
         
        
      }
      else 
      {
        if( this.authService.isNewUser() == true)
        {
          this.isEnableOtherPlan =true;
        }
      }
      
    },
    (err: ApiErrorResponse) => console.log(err)
  );
 }
 getSelectedPlan()
 {
  this.planService.getPlan(this.selectedPlanId).subscribe(
    (res: Plan) =>{
      this.plan = res;
      this.callingFrom    = this.plan.CountryFrom;
      this.callingTo      = this.plan.CountryTo;
      this.toCountryId    = this.plan.CountryTo;
      this.fromCountryId  = this.plan.CountryFrom;
    },
    err => console.log(err),
    () => {
      
      if(this.callingFrom  == 1 || this.callingFrom == 2)
      {
        if(this.plan.CardName == 'CANADA SUPER ONE TOUCH DIAL' || this.plan.CardName == 'SUPER ONE TOUCH DIAL' || this.plan.CardName == 'ONE TOUCH DIAL' || this.plan.CardName == 'CANADA ONE TOUCH DIAL')
        {
          this.getRechargeOption()
        }
        else
        {
          this.getRechargeOption()
        }
      }
      else
      {
        this.getRechargeOption()
      }
      
    }
  );
 }


 showRechargeList()
 {
 // let cards = [88,89,90,91,120,121,125,126,129,130,145,146,163,175,176,177,178,179,180];
  let cards = [163,175,176,177,178,179,180];
   
  if(this.clientCardId > 0)
  {
    if(!cards.includes(this.clientCardId))
    {
      return true;
    }
    else
    return false;
  }
  else
  return false;
  
 }


 showRechargePct()
 {
   let cards = [88,89,90,91,120,121,125,126,129,130,145,146,163,175,176,177,178,179,180];
   
  if(this.clientCardId > 0)
  {
    if(!cards.includes(this.clientCardId))
    {
      return true;
    }
    else
    return false;
  }
  else
  return true;
  
 }

  
  getActiveClass(item, obj)
  {
    if(obj == 'others')
    {
      return this.selectedDenomination == item?'active':'';
    }
    else{
      return this.selectedDenomination == item.Price?'active':'';
    }
    
  }
  getRechargeOption() {
    this.rechargeService.getRechargeAmounts(this.plan.CardId).subscribe(
      (res: number[]) => {
        this.rechargeAmounts = res;
        this.isPremium = false;
        if(res[0] && res.length >0)
        {
          this.denominatons = res[0];//.filter( a => {a.CountryId == this.fromCountryId})
          this.ratesLoaded = true;
          
          let filtered = res.filter( a => { 
            if(a == 10 )
            return a;
          });
        
          this.selectedDenomination = (filtered[0])?filtered[0]:res[0];
          const model: RechargeCheckoutModel = new RechargeCheckoutModel();
          model.purchaseAmount = res[0];
          model.couponCode = '';
          model.currencyCode = this.plan.CurrencyCode;
          model.cvv   = '';
          model.planId = this.plan.PlanId
          model.transactiontype = TransactionType.Recharge;
          model.serviceChargePercentage = this.plan.ServiceChargePercent;
          model.planName = this.plan.CardName;
          model.countryFrom = this.plan.CountryFrom;
          model.countryTo = this.plan.CountryTo;
          model.cardId = this.plan.CardId;
          model.isAutoRefill = this.isAutorefill;
          model.offerPercentage = '';
          this.currentCart = model;
          this.checkoutService.setCurrentCart(model);
      
          /************ To show new reate page enable this page uncomment this ***********/
        //  this.isPremium = true;
        //  this.getRates()

        }
 
      }
    )
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

   async onClickAmountOption(item: any)
   {
    this.selectedDenomination=item.Price;
    const model: RechargeCheckoutModel = new RechargeCheckoutModel();
    model.purchaseAmount = item.Price;
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
    model.isAutoRefill = this.isAutorefill;
    model.offerPercentage = '';
    this.currentCart = model;
    await this.checkoutService.setCurrentCart(model);
    //this.currentCart = await this.checkoutService.getCurrentCart()
    this.initPaypalConfig1()
    
  }


  onClickAmountOptionOthers(item: any)
  {
    console.log(item)
   this.selectedDenomination=item;
   const model: RechargeCheckoutModel = new RechargeCheckoutModel();
   model.purchaseAmount = item;
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
   model.isAutoRefill = this.isAutorefill;
   model.offerPercentage = '';
   this.currentCart = model;
   this.checkoutService.setCurrentCart(model);
   
   this.initPaypalConfig1()
 }
 initPaypalConfig1()
 {
  
      setTimeout(() => {
      this.initPaypalConfig();
    }, 1000);
  
  
 }
 
  onPaymentInfoFormSubmit(creditCard: CreditCard) {
   
   // this.getCurrentCarts(creditCard);
    
  }

  onPaymentButtonTrigger(creditCard: CreditCard) {
    this.currentCartObs$ = this.checkoutService.getCurrentCart().subscribe((model: ICheckoutModel) => {
      if (model === null ) {
        creditCard = null;
         return false;
      }
      else
      {
            this.currentCart = model;
          //console.log('Your model is as ', model);
          this.onCreditCardPayment(creditCard);
      }
      
       
      
    }, err => {
    }, () => {
      this.checkoutService.deleteCart();
    })
  }

  /**
   * On credit card payment Option.
   */
  private onCreditCardPayment(creditCard: CreditCard, aniNumbers?: string[]) {
    let trans_type = '';
    
    if(creditCard)
    {
      localStorage.setItem('selectedCard',  creditCard.CardId.toString());
      let planOrderInfo: ICheckoutOrderInfo;

    planOrderInfo = new RechargeOrderInfo();
        trans_type = 'Recharge';
 

      if (this.currentCart.transactiontype === TransactionType.Recharge) {
        planOrderInfo = new RechargeOrderInfo();
        trans_type = 'Recharge';
      } else if (this.currentCart.transactiontype === TransactionType.Activation || this.currentCart.transactiontype === TransactionType.Sale) {
        planOrderInfo = new ActivationOrderInfo();
        trans_type = 'Sale';
      } else if (this.currentCart.transactiontype === TransactionType.Topup) {
        planOrderInfo = new MobileTopupOrderInfo();
        trans_type = 'Topup';
      }
	 
      if (this.currentCart.transactiontype === TransactionType.Activation) {
        const cart = this.currentCart as NewPlanCheckoutModel;
        cart.pinlessNumbers = [creditCard.PhoneNumber];
      }

      planOrderInfo.creditCard = creditCard;
      planOrderInfo.checkoutCart = this.currentCart;

       if(planOrderInfo.checkoutCart.couponCode == 'FREETRIAL')
      {

         
        let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
        let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
        
      }
      else
      { 

      
        var first_fivenum = creditCard.CardNumber.substring(0, 5);
        this.braintreeService.testProcess(first_fivenum, trans_type).subscribe( (data: ApiProcessResponse)=>{ 
        this.paymentProcessor = data.ThreeDSecureGateway; 

        
          if(data.Use3DSecure)
            {
              
              if (!isNullOrUndefined(planOrderInfo.checkoutCart.couponCode) && planOrderInfo.checkoutCart.couponCode.length > 0) {
                
                this.validateCoupon(planOrderInfo.checkoutCart.getValidateCouponCodeReqModel(planOrderInfo.checkoutCart.couponCode))
                  .then((res: ValidateCouponCodeResponseModel) => {
                    if (res.Status) 
                    {
                      if(planOrderInfo.checkoutCart.couponCode == 'FREETRIAL')
                      {
                        /********** Use3DSecure :false  then process transaction directly **********/
                        let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
                        let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
                      }
                      else
                      {
                        

                        if(this.paymentProcessor=='BrainTree')
                        {
                         
                          this.transactionService.processPaymentToBraintree(planOrderInfo );
                        }
                        else
                        {
                          this.transactionService.processPaymentToCentinel(planOrderInfo);
                        }
                      }
                    } else {
                      this.handleInvalidCouponCodeError();
                    }
                  }).catch(err => {
                    this.handleInvalidCouponCodeError();
                  });
              } 
              else 
              {
            
              
                  if(this.paymentProcessor== 'BrainTree')
                  {
                    this.transactionService.processPaymentToBraintree(planOrderInfo);
                  }
                  else
                  {
                    this.transactionService.processPaymentToCentinel(planOrderInfo);
                  }
              } 
          }
          else
          {
            /********** Use3DSecure :false  then process transaction directly **********/
            let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
            let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
            
          }
        });
      }
  }
  }


// Validate coupon code.
validateCoupon(req: ValidateCouponCodeRequestModel): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
  return this.transactionService.validateCouponCode(req).toPromise();
}

  handleInvalidCouponCodeError() {
    let error = new ErrorDialogModel();
    error.header = 'Invalid Coupon Code';
    error.message = 'Please check your information and try again.';

    this.currentCart.isHideCouponEdit = false;
    this.currentCart.couponCode = null;

    this.openErrorDialog(error);
  }

  openErrorDialog(error: ErrorDialogModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { error }
    });
  }


  getRateDetail(): void 
  {
    this.toCountryId    = this.plan.CountryTo;
          this.fromCountryId  = this.plan.CountryFrom;
    this.dialog.open(ViewratesComponent, {
      data: { 
        denominations: this.denominatons,
        countryFrom:this.fromCountryId,
        countryTo:this.toCountryId,
         
       }
    });
  }

  getAutoRefillMin(item):void{

    let discount = Math.round(item.TotalTime*10/100);
    return item.TotalTime+discount;

  }
  toFixed(num) {
    
    return Math.floor(num*10)/10;
     //return ( num * 10  / 10 ).toFixed(1)
    }
  getAutoRefillRatePerMin(item){
    let discount = Math.round(item.TotalTime*10/100);
    let min = item.Price / (item.TotalTime+discount);
    return this.toFixed(min*100 );
    

  }
  
}
