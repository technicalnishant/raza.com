import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../core/services/api.constants';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { OrderHistory } from '../models/orderHistory';
import { FullHistory } from '../models/fullHistory';
import { BillingInfo } from '../models/billingInfo';
import { ProfileSnapshot } from '../models/profileSnapshot'
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { pinlessNumber } from '../models/pinlessNumber';
import { AutoRefill } from '../models/autorefill';

import { CustomErrorHandlerService } from '../../core/services/custom-error-handler.service';
import { CreditCard } from '../models/creditCard';
import {CreditCardFull } from '../models/creditCardFull';


@Injectable({ providedIn: 'root' })
export class CustomerService {
    constructor(private httpClient: HttpClient,
        
        private errorHandleService: CustomErrorHandlerService) { }

    //Get Access Number of customer.
    public getAccessNumber(pin): Observable<string[] | ApiErrorResponse> {
        return this.httpClient.get<string[]>(`${Api.myAccount.accessNumber}` + "/" + pin)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    
    //Get Order History of customer.
    public getFullOrderHistory(obj, page: number): Observable<OrderHistory[] | ApiErrorResponse> {
        return this.httpClient.get<OrderHistory[]>(`${Api.myAccount.newOrderHistory}?orderType=${obj}&page=${page}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    //Get Order History of customer.
    public getOrderHistory(page: number): Observable<OrderHistory[] | ApiErrorResponse> {
        return this.httpClient.get<OrderHistory[]>(`${Api.myAccount.orderHistory}?page=${page}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

  //  https://restapi.razacomm.com/api/OrderHistory/FullHistory?page=1
  //  https://restapi.razacomm.com/api/OrderHistory/FullHistory?page=1 
    //Get Order History of customer.
    public getOrderHistory1(page: number): Observable<FullHistory[] | ApiErrorResponse> {
        return this.httpClient.get<FullHistory[]>(`${Api.myAccount.fullHistory}?page=${page}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    /* Start customer credit card. */
    public getSavedCreditCards1(): Observable<CreditCard[] | ApiErrorResponse> {
        return this.httpClient.get<CreditCard[]>(`${Api.myAccount.creditCard}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    // public SaveCreditCard(body: any): Observable<boolean | ApiErrorResponse> {
    //     return this.httpClient.post(`${Api.myAccount.creditCard}`, body)
    //         .pipe(
    //             map(res => { return true }),
    //             catchError(err => this.errorHandleService.handleHttpError(err))
    //         );
    // }

    public getSavedCreditCards(): Observable<CreditCard[] | ApiErrorResponse> {
        return this.httpClient.get<CreditCard[]>(`${Api.myAccount.completeCreditcards}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }
    public SaveCreditCard(body: any): Observable<boolean | ApiErrorResponse> {
        return this.httpClient.post(`${Api.myAccount.saveCompleteCreditcard}`, body)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public DeleteCreditCard(cardid: any): Observable<boolean | ApiErrorResponse> {
       /* 
            return this.httpClient.delete(`${Api.myAccount.creditCard}` + "/" + cardid)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
        */
            var body = {CreditCardId:cardid}
            return this.httpClient.post(`${Api.myAccount.removeCreditCard}`, body)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );

            
    }

    public EditCreditCard(card): Observable<CreditCard | ApiErrorResponse> {
        return this.httpClient.get<CreditCard>(`${Api.myAccount.creditCard}` + "/" + card.CardId)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public EditCreditCardbyId(cardId): Observable<CreditCard | ApiErrorResponse> {
        return this.httpClient.get<CreditCard>(`${Api.myAccount.creditCard}` + "/" +cardId)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public GetBillingInfo(): Observable<any | ApiErrorResponse> {
        return this.httpClient.get<any>(`${Api.myAccount.getBillingInfo}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    /* End customer credit card. */

    /* Start customer Pin Less. */

    public DeletePinLess(planId: string, body: any): Observable<boolean | ApiErrorResponse> {
        return this.httpClient.post(`${Api.pinless.deletePinless}` + "/" + planId, body)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public getSavedPinLess(planId): Observable<pinlessNumber[] | ApiErrorResponse> {
        return this.httpClient.get<pinlessNumber[]>(`${Api.pinless.getPinLess}` + "/" + planId)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public SavePinLess(pin, body): Observable<pinlessNumber[] | ApiErrorResponse> {
        return this.httpClient.post<pinlessNumber[]>(`${Api.pinless.getPinLess}` + "/" + pin, body)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    /* End customer Pin Less. */

    /* GET customer Billing Info. */
    public getCustomerBillingInfo(): Observable<BillingInfo | ApiErrorResponse> {
        return this.httpClient.get<BillingInfo>(`${Api.myAccount.customers}` + "/BillingInfo")
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public SaveCustomerBillingInfo(model: any): Observable<boolean | ApiErrorResponse> {
        return this.httpClient.post<boolean>(`${Api.myAccount.customers}` + "/BillingInfo", model)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public getProfileSnapShot(): Observable<ProfileSnapshot | ApiErrorResponse> {
        return this.httpClient.get<ProfileSnapshot>(`${Api.myAccount.customers}` + "/Snapshot")
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }


    /* One Touch Set Up Start */

    public getNumbers(pin: string, countryId: string, stateId: string, areaCode: string): Observable<string[] | ApiErrorResponse> {

        return this.httpClient.get<string[]>(`${Api.plan.onetouchSetup}/${pin}/AvailableNumbers/${countryId}/${stateId}/${areaCode}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public postOneTouchSetUp(pin: any, body: any): Observable<boolean | ApiErrorResponse> {
       // console.log(pin, body);
        return this.httpClient.post(`${Api.oneTouch.onetouchSetup}` + "/" + pin, body)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public deleteOneTouchSetUp(pin: any, body: any): Observable<boolean | ApiErrorResponse> {
        return this.httpClient.post(`${Api.oneTouch.onetouchSetupDelete}` + "/" + pin, body)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    /* End Touch Set Up Start. */

    /* Auto Refill Start. */

    public postAutoRefill(planId: any, body: any): Observable<boolean | ApiErrorResponse> {
        return this.httpClient.post(`${Api.autoRefill.postAutoRefill}` + "/" + planId, body)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public DeleteAutoRefill(planId: any): Observable<boolean | ApiErrorResponse> {
        return this.httpClient.delete(`${Api.pinless.deletePinless}` + "/" + planId)
            .pipe(
                map(res => { return true }),
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public getAutoRefill(planId: string): Observable<AutoRefill | ApiErrorResponse> {
        return this.httpClient.get<AutoRefill>(`${Api.autoRefill.getAutoRefill}/${planId}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    public deleteAutoRefill(planId: string): Observable<any | ApiErrorResponse> {

        

        return this.httpClient.delete<any>(`${Api.autoRefill.deleteAutoRefillV1}/${planId}`)
        .pipe(
            map(res => {
                return true;
            }),
            catchError(err => this.errorHandleService.handleHttpError(err))
        );

        // return this.httpClient.delete<any>(`${Api.autoRefill.getAutoRefill}/${planId}`)
        //     .pipe(
        //         map(res => {
        //             return true;
        //         }),
        //         catchError(err => this.errorHandleService.handleHttpError(err))
        //     );
    }

    public editAutoRefill(planId: string): Observable<any | ApiErrorResponse> {
        return this.httpClient.delete<any>(`${Api.autoRefill.getAutoRefill}/${planId}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }
    /* Auto Refill End. */

    referFriends(emails: string[]) {
        return this.httpClient.post(Api.customer.referFriend, emails);
    }

    referFriendsDetail(): Observable<[] | ApiErrorResponse> {
        return this.httpClient.get<[]>(`${Api.customer.referFrienddetail}`)
            .pipe(
                catchError(err => this.errorHandleService.handleHttpError(err))
            );
    }

    referFriendnew(emails: string[]) {

        let data = {
            "FriendEmails": [
              "abc@xyz.com",
              "aaa@bbb.com"
            ],
            "ReferrerType": "GIVE5GET5",
            "IPAddress": "111.222.333.444"
          }
        return this.httpClient.post(Api.customer.referFriend, emails);
    }

    public getReferrerCode(phone: any): Observable<[] | ApiErrorResponse> {
        return this.httpClient.get<[]>(`${Api.rewards.getReferrerCode}/${phone}/website`)
          .pipe(
            catchError(err => this.errorHandleService.handleHttpError(err))
          );
      }

}