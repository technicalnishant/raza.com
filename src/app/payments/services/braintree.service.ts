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

declare var Cardinal: any;

@Injectable({ providedIn: 'root' })
export class BraintreeService {

  constructor(
		private httpClient: HttpClient,
        private errorHandleService: CustomErrorHandlerService,
        private cardinalPaymentService: CardinalPaymentService,
        public dialog: MatDialog,
		) { }
		
		
		getBraintreeToken()
    {
        return this.httpClient.get (`${Api.braintree.generateToken}`);
        /*this.httpClient.get(Api.braintree.generateToken)
        .subscribe((data:any) => {
        return data.token;
            });*/
     }

    testProcess(obj, transType){
         
        //return this.httpClient.get (`${Api.transactions.processor}`+'/'+obj);   
        return this.httpClient.get (`${Api.transactions.newProcessor}`+'/'+obj+"/"+transType);  
       /* this.httpClient.get(Api.transactions.processor)
        .subscribe((data:any) => {
        return data;
            }); */
    }
	
}
