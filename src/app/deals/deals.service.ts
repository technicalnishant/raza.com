import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Api } from '../core/services/api.constants';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { Deal } from './model/deal';
import { Country } from '../home/model/country';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { DealRate } from './model/dealRate';
import { Promotion } from './model/Promotion';

@Injectable({ providedIn: 'root' })
export class DealsService {
    constructor(private httpClient: HttpClient) { }

    public getAllDeals(): Observable<Deal[] | ApiErrorResponse> {
        return this.httpClient.get<Deal[]>(`${Api.deals.getAllDeals}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public getDealPramotionId(pramotionId): Observable<Deal[] | ApiErrorResponse> {
        return this.httpClient.get<Deal[]>(`${Api.deals.getDealPramotionId}` + '/' + pramotionId)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public getCountryTo(pramotionCode: string, countryFrom: number): Observable<Country[] | ApiErrorResponse> {
        return this.httpClient.get<Country[]>(`${Api.Promotions.get}/countryTo/${countryFrom}/${pramotionCode}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public getPromotionPlan(promotioncode: string, countryFrom: number, countryTo: number): Observable<Deal | ApiErrorResponse> {
        return this.httpClient.get<Deal>(`${Api.deals.getPromotionPlan}/${promotioncode}/${countryFrom}/${countryTo}`)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public getCountryCallAsia(countryFrom): Observable<DealRate[] | ApiErrorResponse> {
        return this.httpClient.get<DealRate[]>(`${Api.deals.getDealCallAsia}` + '/' + countryFrom)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );

           
    }

    public getCountryCallAfrica(countryFrom): Observable<DealRate[] | ApiErrorResponse> 
    {
        return this.httpClient.get<DealRate[]>(`${Api.deals.getDealCallAfrica}` + '/' + countryFrom)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
         
       
    }


    public getCountryCallAsia1(countryFrom, type): Observable<DealRate[] | ApiErrorResponse> {
        // return this.httpClient.get<DealRate[]>(`${Api.deals.getDealCallAsia}` + '/' + countryFrom)
        //     .pipe(
        //         catchError(err => this.handleHttpError(err))
        //     );

            return this.httpClient.get<DealRate[]>(`${Api.countries.getCallDetails}` + '/' + countryFrom+ '/'+type)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }

    public getCountryCallAfrica1(countryFrom, type): Observable<DealRate[] | ApiErrorResponse> 
    {
        // return this.httpClient.get<DealRate[]>(`${Api.deals.getDealCallAfrica}` + '/' + countryFrom)
        //     .pipe(
        //         catchError(err => this.handleHttpError(err))
        //     );
         
        return this.httpClient.get<DealRate[]>(`${Api.countries.getCallDetails}` + '/' + countryFrom+ '/'+type)
            .pipe(
                catchError(err => this.handleHttpError(err))
            );
    }


    handleHttpError(err: HttpErrorResponse): Observable<ApiErrorResponse> {
        let errorResposne = new ApiErrorResponse();
        errorResposne.errorNumber = err.status;
        errorResposne.message = err.statusText;
        errorResposne.friendlyMessage = "An Error Occurred when retrieving data";

        return throwError(errorResposne);
    }

}