import { Observable, pipe, of, from } from "rxjs";
import { Order, Account } from "../models/cardinal-cruise.model";
import { HttpClient } from "@angular/common/http";
import { CustomErrorHandlerService } from "../../core/services/custom-error-handler.service";
import { Api } from "../../core/services/api.constants";
import { catchError } from "rxjs/operators";
import { EventEmitter, Injectable } from "@angular/core";
import { TransactionRequest, TransactionType } from "../models/transaction-request.model";
import { TransactionResponseModel } from "../models/transaction-response.model";
import { CardinalPaymentService } from "./cardinal-payment.service";
import { BraintreePaymentService } from "./braintree-payment.service";
import { BrainTreePaymentMobileService } from "./brain-tree-payment-mobile.service";
import { GenerateTransactionRequestModel } from "../models/generate-transaction-req.model";
import { group } from "@angular/animations";
import { ApiErrorResponse } from "../../core/models/ApiErrorResponse";
import { CardinalResponse } from "../models/cardinal-response.model";
import { RechargeService } from "../../recharge/services/recharge.Service";
import { RechargeRequestModel } from "../../recharge/models/recharge-trans-request.model";
import { PaymentMethod } from "../models/payment-method";
import { Router } from "@angular/router";
import { PaymentFailedDialogComponent } from "../dialogs/payment-failed-dialog/payment-failed-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { IsCentinelBypassRequestModel } from "../models/isCentinelByPass-request.model";
import { Plan } from "../../accounts/models/plan";
import { PlanOrderInfo, ICheckoutOrderInfo } from "../models/planOrderInfo.model";
import { ValidateCouponCodeRequestModel, ValidateCouponCodeResponseModel } from "../models/validate-couponcode-request.model";
import { AuthenticationService } from "../../core/services/auth.service";
import { map } from 'rxjs/operators';


import { DirectPaymentService } from "./direct-payment.service";

declare var Cardinal: any;

@Injectable({ providedIn: 'root' })
export class TransactionService {

    constructor(
        private httpClient: HttpClient,
        private errorHandleService: CustomErrorHandlerService,
        private cardinalPaymentService: CardinalPaymentService,
        private braintreePaymentService:BraintreePaymentService,
        private braintreePaymentMobileService:BrainTreePaymentMobileService,
        private directPaymentService:DirectPaymentService,
        public dialog: MatDialog,
    ) {

    }



     
getClientTokenFunction():void{
    this.httpClient.get(Api.braintree.generateToken)
    .subscribe((data:any) => {
     return data.token;
       
    });
     
    /*  this.httpClient.get(Api.braintree.generateToken, { responseType: 'json' }).pipe(map(data=>{})).subscribe(result => {
        result;
      });*/
}	
	
    generate(reqModel: GenerateTransactionRequestModel): Observable<TransactionRequest | ApiErrorResponse> {
        return this.httpClient.post<TransactionRequest>(Api.transactions.generate, reqModel)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            )
    }
    
    generateMobile(reqModel: GenerateTransactionRequestModel): Observable<TransactionRequest | ApiErrorResponse> {
        return this.httpClient.post<TransactionRequest>(Api.transactions.generate, reqModel)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            )
    }

    generatePaypalOrder(reqModel: GenerateTransactionRequestModel): Observable<string> {
        return this.httpClient.post<string>(Api.transactions.generatePaypalOrder, reqModel);

    }

    isCentinelByPass(model: IsCentinelBypassRequestModel): Observable<boolean | ApiErrorResponse> {
        return this.httpClient.post<boolean>(Api.transactions.iscentinelBypass, model)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            )
    }

    processPaymentToCentinel(checkoutOrderInfo: ICheckoutOrderInfo): void {

        let transactionReq: TransactionRequest;
        this.generate(checkoutOrderInfo.checkoutCart.getTransactionReqModel()).subscribe(
            (res: TransactionRequest) => {
                //  console.log("Executing first observable response");
                transactionReq = res;

                //this information will passdown to server.

                let account = new Account();
                account.AccountNumber = checkoutOrderInfo.creditCard.CardNumber;
                account.ExpirationMonth = checkoutOrderInfo.creditCard.ExpiryMonth.toString();
                account.ExpirationYear = `${new Date().getFullYear().toString().slice(0, 2)}${checkoutOrderInfo.creditCard.ExpiryYear.toString()}`;
                account.NameOnCard = checkoutOrderInfo.creditCard.CardHolderName;

                transactionReq.checkoutOrderInfo = checkoutOrderInfo;
                transactionReq.Order.Consumer.Account = account;
                transactionReq.TransactionType = checkoutOrderInfo.checkoutCart.transactiontype;

                return this.cardinalPaymentService.startCardinalTransaction(transactionReq);
            }
        );
    }
    
    processPaymentToBraintree(checkoutOrderInfo: ICheckoutOrderInfo): void {

        let transactionReq: TransactionRequest;
        console.log(checkoutOrderInfo.checkoutCart);
        this.generate(checkoutOrderInfo.checkoutCart.getTransactionReqModel()).subscribe(
            (res: TransactionRequest) => {
                //  console.log("Executing first observable response");
                transactionReq = res;
                 
                if(localStorage.getItem('IsMoto') && localStorage.getItem('IsMoto') == 'yes')
                {
                    transactionReq.Order.OrderDetails.OrderNumber = localStorage.getItem('moto_orderid');
                }
                
                 
                 
                let account = new Account();
                account.AccountNumber = checkoutOrderInfo.creditCard.CardNumber;
                account.ExpirationMonth = checkoutOrderInfo.creditCard.ExpiryMonth.toString();
                account.ExpirationYear = `${new Date().getFullYear().toString().slice(0, 2)}${checkoutOrderInfo.creditCard.ExpiryYear.toString()}`;
                account.NameOnCard = checkoutOrderInfo.creditCard.CardHolderName;

                transactionReq.checkoutOrderInfo = checkoutOrderInfo;
                transactionReq.Order.Consumer.Account = account;
                transactionReq.TransactionType = checkoutOrderInfo.checkoutCart.transactiontype;
              
                 return this.braintreePaymentService.startCardinalTransaction(transactionReq);
            }
        );
    }
	

    processMobPaymentToBraintree(checkoutOrderInfo: ICheckoutOrderInfo): void {

        let transactionReq: TransactionRequest;
        this.generateMobile(checkoutOrderInfo.checkoutCart.getTransactionReqModel()).subscribe(
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
            
                 return this.braintreePaymentMobileService.startCardinalTransaction(transactionReq);
            }
        );
    }
	
	   processPaymentNormal(checkoutOrderInfo: ICheckoutOrderInfo): void {

        let transactionReq: TransactionRequest;
        this.generate(checkoutOrderInfo.checkoutCart.getTransactionReqModel()).subscribe(
            (res: TransactionRequest) => {
                //  console.log("Executing first observable response");
                transactionReq = res;
                console.log(transactionReq);
                //this information will passdown to server.

                let account = new Account();
                account.AccountNumber = checkoutOrderInfo.creditCard.CardNumber;
                account.ExpirationMonth = checkoutOrderInfo.creditCard.ExpiryMonth.toString();
                account.ExpirationYear = `${new Date().getFullYear().toString().slice(0, 2)}${checkoutOrderInfo.creditCard.ExpiryYear.toString()}`;
                account.NameOnCard = checkoutOrderInfo.creditCard.CardHolderName;

                transactionReq.checkoutOrderInfo = checkoutOrderInfo;
                transactionReq.Order.Consumer.Account = account;
                transactionReq.TransactionType = checkoutOrderInfo.checkoutCart.transactiontype;
                 
				return this.directPaymentService.startTransaction(transactionReq);
            }
        );
    }
	
    openPaymentFailedDialog(): void {
        this.dialog.open(PaymentFailedDialogComponent);
    }

    /* Validate coupon code */
    validateCouponCode(model: ValidateCouponCodeRequestModel): Observable<ValidateCouponCodeResponseModel | ApiErrorResponse> {
        return this.httpClient.post<ValidateCouponCodeResponseModel>(Api.transactions.validateCoupon, model).pipe(
            catchError(err => this.errorHandleService.handleHttpError(err))
        )
    }
    getBraintreeToken()
    {
        return this.httpClient.get (`${Api.braintree.generateToken}`);
       /* this.httpClient.get(Api.braintree.generateToken)
        .subscribe((data:any) => {
        return data.token;
            });*/
     }

    testProcess(){
         
        return this.httpClient.get (`${Api.transactions.processor}`);   
       /* this.httpClient.get(Api.transactions.processor)
        .subscribe((data:any) => {
        return data;
            }); */
    }
}