import { ActivatedRoute } from '@angular/router';
import { Observable} from "rxjs";
 
import { throwError as observableThrowError,  of, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import * as braintree from 'braintree-web';
//import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';

import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../../../../payments/models/planOrderInfo.model';
import { IOnApproveCallbackData, IPayPalConfig } from '../../../../payments/paypal/model/paypal.model';
import { TransactionType } from '../../../../payments/models/transaction-request.model';
import { NewPlanCheckoutModel, ICheckoutModel, RechargeCheckoutModel } from '../../../models/checkout-model';
import { PurchasePlanReqModel } from '../../../../purchase/models/purchase-plan-req.model';
import { Country } from '../../../../core/models/country.model';
import { CodeValuePair } from '../../../../core/models/codeValuePair.model';
import { State } from '../../../../accounts/models/billingInfo';
import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../../../../payments/models/validate-couponcode-request.model';
import { ApiErrorResponse } from '../../../../core/models/ApiErrorResponse';
import { ErrorDialogModel } from '../../../../shared/model/error-dialog.model';
import { CreditCard } from '../../../../accounts/models/creditCard';

import { environment } from '../../../../../environments/environment';

import { TransactionService } from '../../../../payments/services/transaction.service';
import { BraintreeService } from '../../../../payments/services/braintree.service';
import { TransactionProcessFacadeService } from '../../../../payments/services/transactionProcessFacade';
import { RazaLayoutService } from '../../../../core/services/raza-layout.service';
import { ScriptService } from '../../../../payments/paypal/service/script.service';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { ErrorDialogComponent } from '../../../../shared/dialog/error-dialog/error-dialog.component';
import { isNullOrUndefined } from "../../../../shared/utilities";
 
import { HttpClient, HttpHeaders } from '@angular/common/http';
 import { map } from 'rxjs/operators';
 import { ApiProcessResponse } from '../../../../core/models/ApiProcessResponse';  
 import { TransactionProcessBraintreeService } from "../../../../payments/services/transactionProcessBraintree";
import { CheckoutService } from 'app/checkout/services/checkout.service';
import { PlanService } from 'app/accounts/services/planService';
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss'],
  providers: [
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ]
})
export class PaymentOptionsComponent implements OnInit {
  subscriptions$: Subscription;
  currentCart: ICheckoutModel;
  public payPalConfig?: IPayPalConfig;
  purchasePlanReq: PurchasePlanReqModel;
  countries: Country[]
  months: CodeValuePair[];
  years: CodeValuePair[];
  states: State[];
  isLoggedIn: boolean = false;
  baseUrl = environment.apiHost;
  data_arr:[];
  braintreeToken:any;
  paymentProcessor:any;
  process:ApiProcessResponse[];

  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;
  planInfo:any;
  constructor(
    private transactionService: TransactionService,
    private transactionProcessFacade: TransactionProcessFacadeService,
    private transactionProcessBraintree: TransactionProcessBraintreeService,
    private dialog: MatDialog,
    private razaLayoutService: RazaLayoutService,
    private scriptService: ScriptService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
	private braintreeService: BraintreeService,
  private checkoutService: CheckoutService,
  private planService: PlanService,
     
  ) { }

  ngOnInit() {
    this.currentCart = this.route.parent.snapshot.data['cart'];
    console.log("Current Cart before is as ", this.currentCart);
    if(this.currentCart.transactiontype == 1)
    {
      let usersPlan = JSON.parse(localStorage.getItem("currentPlan"));
      if( usersPlan && usersPlan.CardId)
      {
        this.planInfo = usersPlan
        
        this.setCartPlanName();
        console.log("Current Cart after is as ", this.currentCart);
      }
      this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe((data) =>{
       
       this.planInfo = data;  
       this.setCartPlanName();
        
      } )

     
      
      
    }
    
   
    //this.currentCart.transactiontype

    this.razaLayoutService.setFixedHeader(true);
 
    this.initPaypalConfig();
    this.razaLayoutService.setFixedHeader(true);
    this.isLoggedIn = this.authService.isAuthenticated();
    this.scriptService.cleanupAndRegisterScript(environment.songbirdJsUrl, 'Cardinal', (res) => {
    });
    this.paymentProcessor = 'Cardinal'
	 //this.checkPaymentProcess();
    //this.getBraintreeToken();
     
  }

  setCartPlanName()
  {
    let cardId = this.planInfo.CardId;
        let cardName = this.planInfo.CardName; 
    const cart: RechargeCheckoutModel  = this.currentCart as RechargeCheckoutModel ;
    cart.cardId =  cardId;
    cart.planName = cardName;
    this.checkoutService.setCurrentCart(cart);
    this.currentCart = this.route.parent.snapshot.data['cart'];
  }
/*
	getBraintreeToken()
	  {
		this.braintreeService.getBraintreeToken().subscribe(data => this.braintreeToken = data);
		  
	  } */
    checkPaymentProcess()
	  {
		  
    };
  

  
  ngOnDestroy(): void {
    this.scriptService.cleanup(environment.songbirdJsUrl, 'Cardinal');
  }

  onPaymentInfoFormSubmit(creditCard: CreditCard) {
    this.onCreditCardPayment(creditCard);
  }

  get enablePaypalOption() {
    return this.currentCart.transactiontype != TransactionType.Topup;
	
	
  }

  /**
   * On credit card payment Option.
   */
  private onCreditCardPayment(creditCard: CreditCard, aniNumbers?: string[]) {
    let trans_type = '';
 
    localStorage.setItem('selectedCard',  creditCard.CardId.toString());
    let planOrderInfo: ICheckoutOrderInfo;
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
		console.log(trans_type);
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

  //
  paymentResponse: any;
  chargeAmount = 55.55;

  onDropinLoaded(event) {
    console.log('dropin loaded...');
  }

  onPaymentStatus(response): void {
    this.paymentResponse = response;
  }
  getClientToken_old(){
    //return this.braintree.getClientToken;
  }
  getClientTokenUrl(){
      return this.baseUrl+"api/BrainTree/GenerateToken";
  }
  getClientCheckoutUrl(){
    return this.baseUrl+"api/BrainTree/createpurchase";
  }
 
  getClientToken() {
  return this.transactionService.getClientTokenFunction();
  }


  

  } 
