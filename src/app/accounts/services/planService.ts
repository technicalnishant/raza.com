import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { rxSubscriber } from 'rxjs/internal-compatibility';
import { Api } from '../../core/services/api.constants';
import { Plan } from '../models/plan';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CustomErrorHandlerService } from '../../core/services/custom-error-handler.service';
import { pinlessNumber } from '../models/pinlessNumber';
import { OneTouchNumber } from '../models/onetouchNumber';
import { CallForwardingSetup } from '../models/callForwardingSetup';
import { planSnapshot } from '../models/planSnapshot';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { Rewards, RedeemedPoint, EarnedPoint } from '../models/rewardpoints';
import { CallDetail } from '../models/callDetail';


@Injectable({ providedIn: 'root' })
export class PlanService {
  currentPlan:any;
  constructor(private httpClient: HttpClient,
    private errorHandleService: CustomErrorHandlerService) { }

  //Get Customer plans
  public getPlan(planId: string): Observable<Plan | ApiErrorResponse> {

    const cachedData = sessionStorage.getItem(planId);

    if (cachedData) {
      console.log("Plan Data is as ", cachedData);
      return of(JSON.parse(cachedData));
    }

    return this.httpClient.get<Plan>(`${Api.plan.getPlan}/${planId}`)
      .pipe(
        tap(data => {
          if(data.PlanId && data.PlanId != '')
          sessionStorage.setItem(planId, JSON.stringify(data));
        }),
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  public getDefaultPlan(): Observable<Plan | ApiErrorResponse> {
    return this.httpClient.get<Plan>(`${Api.plan.getPlan}/default`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  //Get Customer plans by pinless number
  public getPlanByPinlessNumber(pinlessNumber: string): Observable<Plan | ApiErrorResponse> {
    return this.httpClient.get<Plan>(`${Api.plan.getPlan}/PinlessNumeber/${pinlessNumber}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  public getPlanByCardId(cardId: number): Observable<Plan | ApiErrorResponse> {
    return this.httpClient.get<Plan>(`${Api.plan.getPlan}/Card/${cardId}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  //Get Customer plans
  public getAllPlans(): Observable<Plan[] | ApiErrorResponse> {

    return this.httpClient.get<Plan[]>(`${Api.plan.getPlan}`)
      .pipe(map(res => {
        return res.map(plan => Object.assign(new Plan(), plan));
      }),
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
}


  //Get Customer plans
  public getCustomPlans(): Observable<Plan[] | ApiErrorResponse> {

    let endpoint = 'plan_info_'+localStorage.getItem("login_no");
    const cachedData = sessionStorage.getItem(endpoint);
    if (cachedData) {
      return of(JSON.parse(cachedData));
    }
    return this.httpClient.get<Plan[]>(`${Api.plan.getCustomPlan}`)
      .pipe(map(res => {
        let resp = res.map(plan => Object.assign(new Plan(), plan));
        sessionStorage.setItem(endpoint, JSON.stringify(resp));
        return resp
      }),
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }
  public getCallDetail(planId: string, fromlastDays: number): Observable<CallDetail[] | ApiErrorResponse> {
    return this.httpClient.get<CallDetail[]>(`${Api.plan.getPlan}/${planId}/CallHistory/${fromlastDays}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /* Add Pinless Setup. */
  public AddPinlessSetup(planId: string, body: any): Observable<boolean | ApiErrorResponse> {
    return this.httpClient.post<boolean>(`${Api.pinless.PinlessSetup}/${planId}`, body)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*Get pinless Numbers. */
  public getPinlessNumbers(planId: string): Observable<pinlessNumber[] | ApiErrorResponse> {
    return this.httpClient.get<pinlessNumber[]>(`${Api.pinless.PinlessSetup}/${planId}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  public getPinlessNumbersByCustomerId(): Observable<pinlessNumber[] | ApiErrorResponse> {
    return this.httpClient.get<pinlessNumber[]>(`${Api.pinless.PinlessSetup}/Customer`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*Delete pinless Numbers. */
  public DeletePinlessNumber(planId: string, pinlessSetup: pinlessNumber): Observable<boolean | ApiErrorResponse> {
    return this.httpClient.delete<boolean>(`${Api.pinless.PinlessSetup}/${planId}/${pinlessSetup.PinlessNumber}`)
      .pipe(
        map(res => { return true }),
        catchError(err => this.errorHandleService.handleHttpError(err)
        )
      );
  }

  /*Get Onetouch Numbers. */
  public getOneTouchNumbers(planId: string): Observable<OneTouchNumber[] | ApiErrorResponse> {
    return this.httpClient.get<OneTouchNumber[]>(`${Api.plan.onetouchSetup}/${planId}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*Get Callforwarding Setup. */
  public getCallForwardingSetups(planId: string): Observable<CallForwardingSetup[] | ApiErrorResponse> {

    return this.httpClient.get<CallForwardingSetup[]>(`${Api.callForwarding.CallForwardingSetup}` + "/" + planId)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  public deleteCallForwardingSetups(planId: string, setupId: number): Observable<boolean | ApiErrorResponse> {
    return this.httpClient.delete<boolean>(`${Api.callForwarding.deleteCallForwardingSetup}` + "/" + planId + "/" + setupId)
      .pipe(
        map(res => { return true }),
        catchError(err => this.errorHandleService.handleHttpError(err)
        )
      );
  }


  public getAvailable800Numbers(): Observable<string[] | ApiErrorResponse> {
    return this.httpClient.get<string[]>(`${Api.callForwarding.CallForwardingSetup}/Available800Numbers`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  //Save Call Forward Setup.
  public SaveCallForwardSetup(pin: number, body: any): Observable<boolean | ApiErrorResponse> {
    return this.httpClient.post<boolean>(`${Api.callForwarding.CallForwardingSetup}/${pin}`, body)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  //Delete Call forward setup..
  public deleteCallForwardingSetup(pin: string, id: string): Observable<boolean | ApiErrorResponse> {
    return this.httpClient.delete<boolean>(`${Api.callForwarding.CallForwardingSetup}/${pin}/ ${id}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  //Get plan snapshot..
  public getPlanSnapshot(pin: string): Observable<planSnapshot | ApiErrorResponse> {
    return this.httpClient.get<planSnapshot>(`${Api.plan.getPlan}/${pin}/snapshot`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*Get Reward total */
  public getRewardTotal(): Observable<number | ApiErrorResponse> {
    return this.httpClient.get<number>(`${Api.rewards.totalRewards}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*Get Reward total */
  public getAllEarnedPoints(): Observable<EarnedPoint[] | ApiErrorResponse> {
    return this.httpClient.get<EarnedPoint[]>(`${Api.rewards.earnedPoints}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*Get Reward Friends */
  public getReferedFriends(): Observable<Rewards[] | ApiErrorResponse> {
    return this.httpClient.get<Rewards[]>(`${Api.rewards.friendsRefered}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }

  /*Get Reward Redeemed */
  public getPointsRedeemed(): Observable<RedeemedPoint[] | ApiErrorResponse> {
    return this.httpClient.get<RedeemedPoint[]>(`${Api.rewards.pointsRedeemed}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }


  /*Get Reward Redeemed */
  public getAccessNumber(id: string): Observable<string[] | ApiErrorResponse> {
    return this.httpClient.get<string[]>(`${Api.accessNumbers.accessNumber}/Instance/${id}`)
      .pipe(
        catchError(err => this.errorHandleService.handleHttpError(err))
      );
  }


  public getStoredPlan(phone:any):Observable<any[] | ApiErrorResponse>{
 
    return of(JSON.parse(localStorage.getItem("currentPlan")));
  }
  //Get plan snapshot..
  public getPlanInfo(phone:any):Observable<any[] | ApiErrorResponse>{
     
    // return this.httpClient.get<[]>(`${Api.plan.pinlessNumber}/${phone}`)
    //phone = '7084527523';

    var replaced = phone.replace(/ /g, '');
    replaced = replaced.replace(/[a-z]/g, "");
    replaced = replaced.replace(/[A-Z]/g, "");
    replaced = replaced.replace(/[&\/\\#,+()$~%.`^'":!@_*?<>{}=|]/g, '');
    replaced = replaced.replace(/-/g, '');
    replaced = replaced.replace(/]/g, '');
    replaced = replaced.replace(/;/g, '');
    replaced = replaced.replace(/[\[\]']/g,'' );
    
    // const cachedData = sessionStorage.getItem('pinless_'+replaced);
    // if (cachedData) {
    //   return of(JSON.parse(cachedData));
    // }

    return this.httpClient.get<[]>(`${Api.plan.pinlessNumber}/${replaced}`).pipe(
      tap(data => {
        sessionStorage.setItem('pinless_'+replaced, JSON.stringify(data));
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return of(null);
      }) 
      );
// let plan_info = this.httpClient.get<[]>(`${Api.plan.pinlessNumber}/${replaced}`);
// localStorage.setItem("currentPlan", JSON.stringify(plan_info));
//     return plan_info;


    // this.currentPlan = JSON.parse(localStorage.getItem("currentPlan"))
    //   if(this.currentPlan && this.currentPlan.PlanId)
    //   {
        
    //     return of(this.currentPlan);
    //   }
    //   else{
         
    //     this.currentPlan =  this.httpClient.get<[]>(`${Api.plan.pinlessNumber}/${replaced}`);
       
    //     localStorage.setItem('currentPlan',JSON.stringify(this.currentPlan))
    //     return of(this.currentPlan);
    //   }
    
     
       
  }


  public getNotificationStatus(custId:number, phone: any): Observable<[] | ApiErrorResponse> {
    return this.httpClient.get<[]>(`${Api.myAccount.emailSubscription}/${custId}/${phone}`)
       
  }
  public setNotificationStatus( body: any): Observable<boolean | ApiErrorResponse> {
    return this.httpClient.post(`${Api.myAccount.updateSubscription}`, body)
        .pipe(
            map(res => { return true }),
            catchError(err => this.errorHandleService.handleHttpError(err))
        );
}


public countryRates( body: any): Observable<any | ApiErrorResponse> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/xml'
    })
    
  };

  const httpOptionsPlain = {
    headers: new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/xml'
    }),
    'responseType': 'text' as 'json'
  };

  return this.httpClient.post<any>(`https://services.razacomm.com/razawebservices/raza_mobileapp_services.asmx`, body, httpOptionsPlain)
  .pipe(
    catchError(err => this.errorHandleService.handleHttpError(err))
  );
}





}