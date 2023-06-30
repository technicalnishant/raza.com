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
import { Subscription } from 'rxjs';
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
    
    console.log(model);
  }

  onPaymentInfoFormSubmit(creditCard: CreditCard) {
    
    this.getCurrentCart(creditCard);
  }
  getCurrentCart(creditCard: CreditCard) {
    this.currentCartObs$ = this.checkoutService.getCurrentCart().subscribe((model: ICheckoutModel) => {
      if (model === null) {
         
      }
     // this.currentCart = model;
      console.log('Your model is as ', model);
      this.onCreditCardPayment(creditCard);
       
      
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

  
}
