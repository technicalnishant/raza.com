import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { Api } from '../../core/services/api.constants';
import { CustomErrorHandlerService } from '../../core/services/custom-error-handler.service';
import { RechargeRequestModel } from '../models/recharge-trans-request.model';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { TransactionResponseModel } from '../../payments/models/transaction-response.model';
import { RechargeOptionsModel } from '../models/recharge-options.model';

@Injectable({
    providedIn: "root"
})
export class RechargeService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: CustomErrorHandlerService
    ) { }

    static selectedRechargeAmount = new BehaviorSubject<RechargeOptionsModel>(new RechargeOptionsModel());

    /* get recharge amounts. */
    public getRechargeAmounts(cardId: number): Observable<number[] | ApiErrorResponse> {
        return this.httpClient.get<number[]>(`${Api.recharge.getAmount}/${cardId}`)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            );
    }
	
	public getCustomRechargeAmounts(cardId: number): Observable<number[] | ApiErrorResponse> {
        return this.httpClient.get<number[]>(`${Api.recharge.getWebAmount}/${cardId}`)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            );
    }
    public ProcessRecharge(pin: string, model: RechargeRequestModel): Observable<TransactionResponseModel | ApiErrorResponse> {
	
	
        return this.httpClient.post<TransactionResponseModel>(`${Api.recharge.process}/${pin}`, model)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            )
            // .map(res => {
            //     return res;
            // })
            ;
    }

    public ProcessMobileRecharge(pin: string, model: RechargeRequestModel): Observable<TransactionResponseModel | ApiErrorResponse> {
	
	
        return this.httpClient.post<TransactionResponseModel>(`${Api.recharge.processMobile}/${pin}`, model)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            )
            // .map(res => {
            //     return res;
            // })
            ;
    }

}

