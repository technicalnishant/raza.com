import { Observable, pipe, of, Observer, Subject } from "rxjs";
 
import { Order } from "../models/cardinal-cruise.model";
import { HttpClient } from "@angular/common/http";
import { CustomErrorHandlerService } from "../../core/services/custom-error-handler.service";
import { Api } from "../../core/services/api.constants";
import { catchError } from "rxjs/operators";
import { EventEmitter, Injectable, NgZone} from "@angular/core";
import { TransactionType, TransactionRequest } from "../models/transaction-request.model";
import { ApiErrorResponse } from "../../core/models/ApiErrorResponse";
import { TransactionProcessFacadeService } from "./transactionProcessFacade";
import { TransactionMobProcessBraintreeService} from "./transaction-mob-process-braintree.service";
import { TransactionProcessBraintreeService } from "./transactionProcessBraintree";
import { LoaderService } from "../../core/spinner/services";
import * as braintree from 'braintree-web';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/dialog/error-dialog/error-dialog.component';
import { ErrorDialogModel } from '../../shared/model/error-dialog.model';
 
import { AddCreditcardDialog } from '../../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog'; 
import { State, BillingInfo } from '../../accounts/models/billingInfo';

import { CustomerService } from '../../accounts/services/customerService';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
 
import { CreditCard } from '../../accounts/models/creditCard';
import {PaymentOptionsComponent} from '../../checkout/pages/payment-info/payment-options/payment-options.component'
import { NewPlanCheckoutModel, ICheckoutModel } from '../../checkout/models/checkout-model';
import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../../payments/models/planOrderInfo.model';
import { BraintreeService } from '../../payments/services/braintree.service';
 

import { ApiProcessResponse } from '../../core/models/ApiProcessResponse'; 
import { isNullOrUndefined } from "../../shared/utilities";
import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../../payments/models/validate-couponcode-request.model';
import { Account } from "../models/cardinal-cruise.model";
import { GenerateTransactionRequestModel } from "../models/generate-transaction-req.model";
import { ActivatedRoute } from '@angular/router';
declare var Cardinal: any;

@Injectable({ providedIn: 'root' })
export class BrainTreePaymentMobileService {
  private _jwtToken: string;
  cvvStored: string;
  billingInfo: BillingInfo;
  customerSavedCards: CreditCard[];
  currentCart: ICheckoutModel;
  
  paymentProcessor:any;
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private ngZone: NgZone,
    public dialog: MatDialog,
    //private paymentOptionComponent = new PaymentOptionsComponent <any>();
    private errorHandleService: CustomErrorHandlerService,
   
    private transactionBraintreeService: TransactionMobProcessBraintreeService,
    private loaderService: LoaderService,
    private customerService: CustomerService,
    private razaSnackbarService: RazaSnackBarService,
    private braintreeService: BraintreeService,
    
    private transactionProcessBraintree: TransactionMobProcessBraintreeService,
  ) {

  }

  initTransaction(transaType: TransactionType, order: Order): Observable<TransactionRequest | ApiErrorResponse> {
    return this.httpClient.post<TransactionRequest>(`${Api.transactions.init}/${transaType}`, order)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*
   * init cardinal transaction.
   */
  private initPayment(model: TransactionRequest) {

    Cardinal.setup("init", {
      jwt: this._jwtToken,
      displayLoading: true
    });

    const service = this.loaderService;
    Cardinal.on("ui.render", function () {
      // console.log('ui.render');
      service.displayHard(false);
    });
  }

  private registerPaymentSetupComplete() {
    Cardinal.on('payments.setupComplete', function () {
      //  console.log("payment setup complete");
    });
  }

  private validatePaymentResponse(model: TransactionRequest, nonce:any) {
    let service: TransactionMobProcessBraintreeService = this.transactionBraintreeService;
    const loaderService = this.loaderService;
    service.processTransaction(model, nonce);
   /* Cardinal.on("payments.validated", function (data, jwt) {
      //  console.log('payments.validated', data);

      switch (data.ActionCode) {
        case "SUCCESS":
          service.processTransaction(model, data);
          // Handle successful transaction, send JWT to backend to verify
          break;

        case "NOACTION":
          {
            loaderService.displayHard(false);
            service.processTransaction(model, data);
            //service.onNoActionResult(model, data);
            // Handle no actionable outcome
            break;
          }
        case "FAILURE":
          // Handle failed transaction attempt
          break;

        case "ERROR":
          // Handle service level error
          break;
      }

      Cardinal.off('payments.setupComplete');
      Cardinal.off('payments.validated');

    });*/
  }

  private setupCardinalTransaction(model: TransactionRequest) {

    this.loaderService.displayPaymentHard(true);
   /* Cardinal.configure({
      logging: {
        level: "on",
      }
    });
    this.initPayment(model);
    this.registerPaymentSetupComplete();
    this.validatePaymentResponse(model);*/
  }

  startCardinalTransaction(model: TransactionRequest): void {
  
  this.loaderService.displayPaymentHard(true);
	this.createClient(model);
	//console.log(model);
 /*   this._jwtToken = model.Jwt;

    Cardinal.configure({
      logging: {
        level: "on"
      }
    });

    this.setupCardinalTransaction(model);
    this.startProcessBin(model.Order);
	*/
  }

  openErrorDialog(error: ErrorDialogModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { error }
    });
  }

  createClient(model: TransactionRequest): void {
 // var cart_amount = model.checkoutOrderInfo.checkoutCart.totalAmount();
   console.log(TransactionType.MR);
  console.log(model);
  var currency = model.checkoutOrderInfo.checkoutCart.currencyCode;
   //this.httpClient.get(Api.braintree.generateToken)
   this.httpClient.get(Api.braintree.generateToken+'/'+currency)
        .subscribe((data:any) => {
        var token = data.token;
      let country_code = 1
     /* 
      if(  model.Order.Consumer.BillingAddress.CountryCode == 'US' )
      country_code = 1;
      if(  model.Order.Consumer.BillingAddress.CountryCode == 'CAD' )
      country_code = 2;
      if(  model.Order.Consumer.BillingAddress.CountryCode == 'UK' )
      country_code = 3;
*/

    if(  model.checkoutOrderInfo.checkoutCart.currencyCode == 'USD' )
      country_code = 1;
      if(  model.checkoutOrderInfo.checkoutCart.currencyCode == 'CAD' )
      country_code = 2;
      if(  model.checkoutOrderInfo.checkoutCart.currencyCode == 'GBP' )
      country_code = 3;

		   var data_param = {
				"FirstName": model.Order.Consumer.BillingAddress.FirstName,
				"LastName": model.Order.Consumer.BillingAddress.LastName,
				"HomePhone": '',
				"Address1": model.Order.Consumer.BillingAddress.Address1,
				"Amount": model.checkoutOrderInfo.checkoutCart.totalAmount(),
				"City": model.Order.Consumer.BillingAddress.City,
				"State": model.Order.Consumer.BillingAddress.State,
				"ZipCode": model.Order.Consumer.BillingAddress.PostalCode,
				"Comment1": model.Order.OrderDetails.OrderDescription,
				"Comment2": "",
				"Country":country_code,
				
				"CardNumber": model.checkoutOrderInfo.creditCard.CardNumber,
				"CurrencyCode": model.checkoutOrderInfo.checkoutCart.currencyCode,
				"CvvValue": model.checkoutOrderInfo.creditCard.Cvv,
				"DoAuthorize": "true",
				"EmailAddress":model.Order.Consumer.Email1, 
				"ExpiryDate": model.checkoutOrderInfo.creditCard.ExpiryMonth+'/'+model.checkoutOrderInfo.creditCard.ExpiryYear,
				
				"IpAddress": "111.111.111.111",
				
				"OrderId": model.Order.OrderDetails.OrderNumber,
			};
      
			   //this.httpClient.post<any>(Api.braintree.createNonce+'/312335',data_param).subscribe(data => {
          this.httpClient.post<any>(Api.braintree.createNonce,data_param).subscribe(data => {
          if(data.Nonce && data.Nonce !='' && data.Nonce !=='null') 
          {
             this.validateNonce(model, data, token);
          }
          else
          {
            const loaderService = this.loaderService;
            
            let error = new ErrorDialogModel();
            error.message = data.ResponseMessage;
            //this.openErrorDialog(error);
             if(data.ResponseMessage == 'Card Issuing Bank declined to accept the transaction. Please contact your credit card customer service(2000)')
             {
               this.razaSnackbarService.openError('Please check you card details .');
               localStorage.setItem('errorMsg', 'Please check you card details .');
             }
            else if(data.ResponseMessage == 'Billing Address does not match. ')
            {
              this.razaSnackbarService.openError('Please check your billing information.');
              localStorage.setItem('errorMsg', 'Please check your billing information.');
            }
            else
            {
              this.razaSnackbarService.openError(data.ResponseMessage);
              localStorage.setItem('errorMsg', data.ResponseMessage);
            }

            //this.razaSnackbarService.openError(data.ResponseMessage);
            //localStorage.setItem('errorMsg', data.ResponseMessage);
            localStorage.setItem('errorCode', data.ResponseCode);
            ///this.editCardDetails();
            if(data.ResponseCode == 2)
            {
              localStorage.setItem('selectedCvv', model.checkoutOrderInfo.creditCard.Cvv);
            }
            else
            {
              //localStorage.rmoveItem('selectedCvv');
            }
            localStorage.setItem('errorCode', data.ResponseCode);
            loaderService.displayPaymentHard(false);
            
            let element:HTMLElement = document.getElementById('error_trigger') as HTMLElement;
            element.click();
            return data;
            //ResponseCode
              /*** 
               * ZipCode/PostalCode does not match
               * Billing Address does not match.
               * 
                ResponseCode = "2" for AVS Issue 
                ResponseCode = "3" for CVV issue
                ResponseCode = "4" for invalid credit card(i.e. typo)
                ResponseCode = "5" for invalid expiry date 
                ***/

          }
            
            
            
				  console.log(data);
        } , err => {
          const loaderService = this.loaderService;
          
          loaderService.displayPaymentHard(false);
          let error = new ErrorDialogModel();
          error.message = err.error.Message;
          this.ngZone.run(() => {
            this.openErrorDialog(error);
             
            
          });

        }); 
   
    });
  }

  validateNonce(model: TransactionRequest, data:any, token:any)
  {
    var threeDSecure;
    const loaderService = this.loaderService;
    var Bnonce = '';
    let service: TransactionMobProcessBraintreeService = this.transactionBraintreeService;
         

        
    braintree.client.create({
      // Use the generated client token to instantiate the Braintree client.
      authorization: token
    }).then(function (clientInstance) {
      return braintree.threeDSecure.create({
      'version': '2', 
      'client': clientInstance
      });
    }).then(function (threeDSecureInstance) {
      threeDSecure = threeDSecureInstance;
      
      var my3DSContainer;
      threeDSecure.verifyCard({
       nonce: data.Nonce.Nonce,
       //amount: model.Order.OrderDetails.Amount/100,
       amount: model.checkoutOrderInfo.checkoutCart.totalAmount(),
       addFrame: function (err, iframe) {
         // Set up your UI and add the iframe.
         //my3DSContainer = document.createElement('div');
         if(iframe)
         {
         document.getElementById("mybraintreeDiv").style.display = "block";
         my3DSContainer = document.getElementById('el');
         
         my3DSContainer.appendChild(iframe);
         document.body.appendChild(my3DSContainer);
        }
        else{
          loaderService.displayPaymentHard(false);
        }
         
       },
       removeFrame: function () {
         // Remove UI that you added in addFrame.
        document.body.removeChild(my3DSContainer);
        document.getElementById("mybraintreeDiv").style.display = "none";
      }
      }, function (err, payload) {
       if (err) {
         console.error(err);
       return;
       }
       
        
       console.log("payment Nonce ");
       console.log(payload);
       Bnonce = payload.nonce
       if (payload.liabilityShifted) {
         service.processTransaction(model, Bnonce);
         //submitNonceToServer(payload.nonce);
      } else if (payload.liabilityShiftPossible) {
         // Liablity may still be shifted
         service.processTransaction(model, Bnonce);
      } else {
         // Liablity has not shifted and will not shift
         service.processTransaction(model, Bnonce);
       }

       setTimeout (() => {
          loaderService.displayPaymentHard(false);
        }, 5000);
       
          
         

        
      });
    
    
       
      
    }).catch(function (err) {
      // Handle component creation error
      console.log("Brain tree Error");
      console.log(err.message);
      loaderService.displayPaymentHard(false);
    });
  }
  unSubscribeFromCardinal() {
    Cardinal.off('payments.setupComplete');
    Cardinal.off('payments.validated');
  }

  private startProcessBin(order: Order) {
    Cardinal.trigger("bin.process", order.Consumer.Account.AccountNumber)
      .then(function (results) {
        if (results.Status) {
          //Bin prfiling successfull, Some merchant want to move forward with CCA if profiling is complete.
        } else {

        }
        Cardinal.start('cca', order);
        // Bin profiling , If the card the end user is paying with you may start the CCA flow at the point.
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  loadBillingInfo(cardId): void {
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { this.billingInfo = res;
      
          this.customerService.EditCreditCardbyId(cardId).subscribe(data => {
        
            this.cardBillingAddress(data);
          });
        },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  editCardDetails() {
    //this.loadBillingInfo(cardId);
     
     this.loadBillingInfo(parseInt(localStorage.getItem('selectedCard'), 10));
  }

  cardBillingAddress(data) {
    const dialogRefCard = this.dialog.open(AddCreditcardDialog, {
      maxHeight: '550px',
      maxWidth: '550px',
      data: {
        result: data,
        result2: this.billingInfo
      }
    });

    dialogRefCard.afterClosed().subscribe(result => {
	 /*
	this.cvvStored=result.split(",")[1];
	
     // if (result == "success") {
      if (result.split(",")[0] == "success") {
	  
         
        this.customerService.GetBillingInfo().subscribe(
          (res: any) => { this.billingInfo = res;
          
            //this.onClickCreditCardPay();

            this.customerService.getSavedCreditCards().toPromise().then(
              (res: CreditCard[]) => {
                if (res.length > 0) {
                  this.customerSavedCards = res.splice(0, 2);
                  
                 this.onPaymentInfoFormSubmit(this.customerSavedCards[0]);
        
                   
                }  
            
              });

            
          },
          (err: ApiErrorResponse) => console.log(err),
        ) 
        
      }*/
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )

  }
  onPaymentInfoFormSubmit(creditCard: CreditCard) {
    this.onCreditCardPayment(creditCard);
  }
 
  /**
   * On credit card payment Option. models/checkout-model
   */
  handleInvalidCouponCodeError() {
    let error = new ErrorDialogModel();
    error.header = 'Invalid Coupon Code';
    error.message = 'Please check your information and try again.';

    //this.currentCart.isHideCouponEdit = false;
   // this.currentCart.couponCode = null;

    this.openErrorDialog(error);
  }
  private onCreditCardPayment(creditCard: CreditCard, aniNumbers?: string[]) {
    let trans_type = '';
     console.log(this.route);
     return false;
    let planOrderInfo: ICheckoutOrderInfo;
      if (this.currentCart.transactiontype === TransactionType.Recharge) {
        planOrderInfo = new RechargeOrderInfo();
        trans_type = 'Recharge';
      } 
     else if (this.currentCart.transactiontype === TransactionType.MR) {
        planOrderInfo = new RechargeOrderInfo();
        trans_type = 'MR';
      } 
      else if (this.currentCart.transactiontype === TransactionType.Activation || this.currentCart.transactiontype === TransactionType.Sale) {
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


    var first_fivenum = creditCard.CardNumber.substring(0, 5);
    this.braintreeService.testProcess(first_fivenum, trans_type).subscribe( (data: ApiProcessResponse)=>{ 
    this.paymentProcessor = data.ThreeDSecureGateway; 
      if(data.Use3DSecure)
        {
          if(this.paymentProcessor=='BrainTree')
            {
              this.checkoutProcessAgain(planOrderInfo );
            }
        }
        else
        {
          /********** Use3DSecure :false  then process transaction directly **********/
         // let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
         // let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
          
        }
    });
  }
  generate(reqModel: GenerateTransactionRequestModel): Observable<TransactionRequest | ApiErrorResponse> {
    return this.httpClient.post<TransactionRequest>(Api.transactions.generate, reqModel)
        .pipe(
            catchError(err => this.errorHandleService.handleHttpError(err))
        )
}
  checkoutProcessAgain(checkoutOrderInfo: ICheckoutOrderInfo): void {
    let transactionReq: TransactionRequest;
    this.generate(checkoutOrderInfo.checkoutCart.getTransactionReqModel()).subscribe(
        (res: TransactionRequest) => {
            //  console.log("Executing first observable response");
            transactionReq = res;
            
            let account = new Account();
            account.AccountNumber = checkoutOrderInfo.creditCard.CardNumber;
            account.ExpirationMonth = checkoutOrderInfo.creditCard.ExpiryMonth.toString();
            account.ExpirationYear = `${new Date().getFullYear().toString().slice(0, 2)}${checkoutOrderInfo.creditCard.ExpiryYear.toString()}`;
            account.NameOnCard = checkoutOrderInfo.creditCard.CardHolderName;

            transactionReq.checkoutOrderInfo = checkoutOrderInfo;
            transactionReq.Order.Consumer.Account = account;
            transactionReq.TransactionType = checkoutOrderInfo.checkoutCart.transactiontype;
        
             return this.startCardinalTransaction(transactionReq);
        }
    );
  }

}