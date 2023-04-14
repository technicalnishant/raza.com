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
import { TransactionProcessBraintreeService } from "./transactionProcessBraintree";
import { LoaderService } from "../../core/spinner/services";
import * as braintree from 'braintree-web';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/dialog/error-dialog/error-dialog.component';
import { ErrorDialogModel } from '../../shared/model/error-dialog.model';

 

declare var Cardinal: any;

@Injectable({ providedIn: 'root' })
export class DirectPaymentService {
 private _jwtToken: string;

  constructor(
    private httpClient: HttpClient,
    private ngZone: NgZone,
    public dialog: MatDialog,
    private errorHandleService: CustomErrorHandlerService,
    private transactionFacadeService: TransactionProcessFacadeService,
    private transactionBraintreeService: TransactionProcessBraintreeService,
    private loaderService: LoaderService
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
    let service: TransactionProcessBraintreeService = this.transactionBraintreeService;
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
    
  }

  startTransaction(model: TransactionRequest): void {
  
  this.loaderService.displayPaymentHard(true);
  var Bnonce = '';
    let service: TransactionProcessBraintreeService = this.transactionBraintreeService;
	service.processTransaction(model, '');
  this.loaderService.displayPaymentHard(false);
  }

  openErrorDialog(error: ErrorDialogModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { error }
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
}