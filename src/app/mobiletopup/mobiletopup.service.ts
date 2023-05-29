import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { rxSubscriber } from 'rxjs/internal-compatibility';
import { Api } from '../core/services/api.constants';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { mobileTopupModel } from './model/mobileTopupModel';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { MobileTopupRequestModel } from './model/mobile-topup-Request.model';
import { TransactionResponseModel } from '../payments/models/transaction-response.model';
import { CustomErrorHandlerService } from '../core/services/custom-error-handler.service';

@Injectable({ providedIn: 'root' })
export class MobiletopupService {
    constructor(private httpClient: HttpClient,
        private errorHandlerService: CustomErrorHandlerService
    ) { }

    public GetMobileTopUp(countryId: number, mobileNumber): Observable<mobileTopupModel | ApiErrorResponse> {
        return this.httpClient.get<mobileTopupModel>(`${Api.mobiletopup.PhoneNumberInfo}/${countryId}/${mobileNumber}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public getOperatorsDenomination(countryFrom: number, countryTo: number, operator): Observable<mobileTopupModel | ApiErrorResponse> {
        return this.httpClient.get<mobileTopupModel>(`${Api.mobiletopup.getOperatorsDenomination}/${countryFrom}/${countryTo}/${operator}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public postSentAmount(): Observable<string | ApiErrorResponse> {
        return this.httpClient.get<string>(`${Api.quicklink.postfeedback}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }


    public ProcessTopupRecharge(model: MobileTopupRequestModel): Observable<TransactionResponseModel | ApiErrorResponse> {
        return this.httpClient.post<TransactionResponseModel>(`${Api.mobiletopup.mobiletopup}`, model)
            .pipe(
                catchError(err => this.errorHandlerService.handleHttpError(err))
            )
            // .map(res => {
            //     return res;
            // })
            ;
    }

    handleHttpError(err: HttpErrorResponse): Observable<ApiErrorResponse> {
        let errorResposne = new ApiErrorResponse();
        errorResposne.errorNumber = err.status;
        errorResposne.message = err.statusText;
        errorResposne.friendlyMessage = "An Error Occurred when retrieving data";

        return throwError(errorResposne);
    }

    /*******************/

    public getBundlesTopUp(from: number, to:number, operator:String): Observable<mobileTopupModel | ApiErrorResponse> {
        return this.httpClient.get<mobileTopupModel>(`${Api.mobiletopup.getBundlesInfo}/${from}/${to}/${operator}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public getBundlesInfo(from: number, to:number): Observable<mobileTopupModel | ApiErrorResponse> {
        return this.httpClient.get<mobileTopupModel>(`${Api.mobiletopup.getBundlesDetail}/${from}/${to}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }


    /****************/
}