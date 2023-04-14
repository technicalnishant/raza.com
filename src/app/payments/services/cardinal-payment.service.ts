import { Observable, pipe, of, Observer, Subject } from "rxjs";
import { Order } from "../models/cardinal-cruise.model";
import { HttpClient } from "@angular/common/http";
import { CustomErrorHandlerService } from "../../core/services/custom-error-handler.service";
import { Api } from "../../core/services/api.constants";
import { catchError } from "rxjs/operators";
import { EventEmitter, Injectable } from "@angular/core";
import { TransactionType, TransactionRequest } from "../models/transaction-request.model";
import { ApiErrorResponse } from "../../core/models/ApiErrorResponse";
import { TransactionProcessFacadeService } from "./transactionProcessFacade";
import { LoaderService } from "../../core/spinner/services";

declare var Cardinal: any;

@Injectable({ providedIn: 'root' })
export class CardinalPaymentService {
  private _jwtToken: string;

  constructor(
    private httpClient: HttpClient,
    private errorHandleService: CustomErrorHandlerService,
    private transactionFacadeService: TransactionProcessFacadeService,
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
     // service.displayHard(false);
      service.displayPaymentHard(false);
      
    });
  }

  private registerPaymentSetupComplete() {
    Cardinal.on('payments.setupComplete', function () {
      //  console.log("payment setup complete");
    });
  }

  private validatePaymentResponse(model: TransactionRequest) {
    let service: TransactionProcessFacadeService = this.transactionFacadeService;
    const loaderService = this.loaderService;
    Cardinal.on("payments.validated", function (data, jwt) {
      //  console.log('payments.validated', data);
      console.log("Paymen validate");
      console.log(data);
      switch (data.ActionCode) {
        case "SUCCESS":
          service.processTransaction(model, data);
          // Handle successful transaction, send JWT to backend to verify
          break;

        case "NOACTION":
          {
            //loaderService.displayHard(false);
            loaderService.displayPaymentHard(false);
            
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

    });
  }

  private setupCardinalTransaction(model: TransactionRequest) {

   // this.loaderService.displayHard(true); 
    this.loaderService.displayPaymentHard(true); 
    
    Cardinal.configure({
      logging: {
        level: "on",
      }
    });
    this.initPayment(model);
    this.registerPaymentSetupComplete();
    this.validatePaymentResponse(model);
  }

  startCardinalTransaction(model: TransactionRequest): void {

    this._jwtToken = model.Jwt;

    Cardinal.configure({
      logging: {
        level: "on"
      }
    });

    this.setupCardinalTransaction(model);
    this.startProcessBin(model.Order);
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