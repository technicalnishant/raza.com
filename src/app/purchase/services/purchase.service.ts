import { Injectable } from '@angular/core';
import { PurchasePlanReqModel } from '../models/purchase-plan-req.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { newPinRequestModel } from '../models/new-pin-Request.model';
import { TransactionResponseModel } from '../../payments/models/transaction-response.model';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { HttpClient } from '@angular/common/http';
import { CustomErrorHandlerService } from '../../core/services/custom-error-handler.service';
import { map, catchError } from 'rxjs/operators';
import { Api } from '../../core/services/api.constants';
import { TransactionRequest } from '../../payments/models/transaction-request.model';
import { isSetAccessor } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: CustomErrorHandlerService
  ) { }

  static purchasePlan = new BehaviorSubject<PurchasePlanReqModel>(null);
  static processedTransaction = new BehaviorSubject<TransactionRequest>(null);

  public issueNewPin(model: newPinRequestModel): Observable<TransactionResponseModel | ApiErrorResponse> {
    //console.log("calling issue new pin");
    
   // localStorage.getItem('IsMoto', 'yes');
    //localStorage.getItem('InitiatedBy', plan.InitiatedBy);
    if(localStorage.getItem('IsMoto') &&  localStorage.getItem('IsMoto')  == 'yes')
    {
      model.ProcessedBy = localStorage.getItem('InitiatedBy');
      //localStorage.removeItem('IsMoto');
      localStorage.removeItem('InitiatedBy');
      localStorage.removeItem('moto_orderid');
     return this.httpClient.post<TransactionResponseModel>(`${Api.moto.newPin}`, model)
      .pipe(
        catchError(err => this.errorHandlerService.handleHttpError(err))
      );
    }
    else
    {
      return this.httpClient.post<TransactionResponseModel>(`${Api.acivation.newPin}`, model)
      .pipe(
        catchError(err => this.errorHandlerService.handleHttpError(err))
      );
    }
  }

   
}
