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
export class RechargeRewardService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: CustomErrorHandlerService
    ) { }

    static selectedRechargeAmount = new BehaviorSubject<RechargeOptionsModel>(new RechargeOptionsModel());

    /* get recharge  options amounts. */
    public getRechargeOptions(): Observable<any[] | ApiErrorResponse> {
        return this.httpClient.get<number[]>(`${Api.rewards.rechargeOptions}`)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            );
    }

    /* get redeem recharge points. */

    public redeemRewardRecharge(points: number): Observable<any | ApiErrorResponse> {
        const body = {
            points: points
        };
        return this.httpClient.post<TransactionResponseModel>(`${Api.rewards.redeemPoints}`, body)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            ).pipe(res => {
                return res;
            });
    }

    /*Get Reward Redeemed */
    public postRewardSignUp(): Observable<any> {
        let body = {
            "DateofBirth": '1900-01-01 00:00:00.000'
        };
        return this.httpClient.post<string[]>(`${Api.rewards.rewardSignUp}`, body)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            ).pipe(res => {
                return res;
            });
    }



}

