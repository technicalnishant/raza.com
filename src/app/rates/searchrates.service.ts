import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Api } from '../core/services/api.constants';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';

import { Country } from '../shared/model/country';
import { SearchRate } from '../shared/model/searchRates';
import { PopularRate } from '../shared/model/popularRate';
import { GlobalPlansData } from '../globalrates/model/globalPlansData';
import { GlobalSubPlans } from '../globalrates/model/globalSubPlans';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';

@Injectable({ providedIn: 'root' })
export class SearchRatesService {
        constructor(private httpClient: HttpClient, private razaEnvService: RazaEnvironmentService) { }

        public getAllCountries(): Observable<Country[] | ApiErrorResponse> {
                return this.httpClient.get<Country[]>(`${Api.countries.getAllCountries}`)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }

        public getXChageRateInfo(countryFromId: number): Observable<SearchRate[] | ApiErrorResponse> {
                 return this.httpClient.get<SearchRate[]>(`${Api.rates.getXChageRateInfo} ${countryFromId}`)
                          .pipe(
                                 catchError(err => this.handleHttpError(err))
                          );

               
        }

        public getSearchRates(countryFromId: number): Observable<SearchRate[] | ApiErrorResponse> {
                return this.httpClient.get<SearchRate[]>(`${Api.rates.getSearchRates} ${countryFromId}`)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );

                
                // var file = 'countries_usa.json';
                // if(countryFromId == 2)
                // file = 'countries_cad.json';

                // if(countryFromId == 3)
                // file = 'countries_uk.json';

                // if(countryFromId == 8)
                // file = 'countries_aus.json';
                // if(countryFromId == 20)
                // file = 'countries_nz.json';
                // if(countryFromId == 26)
                // file = 'countries_in.json';

                // console.log(file);
                // return  this.httpClient.get<[]>("./assets/"+file) ;
        }

        public getPopularRates(countryFromId: number): Observable<PopularRate[] | ApiErrorResponse> {
                return this.httpClient.get<PopularRate[]>(`${Api.rates.getPopularRates} ${countryFromId}`)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }

        public getSearchGlobalRates(countryFromId: number, countryToId: number): Observable<GlobalPlansData[] | ApiErrorResponse> {
                return this.httpClient.get<GlobalPlansData[]>(`${Api.rates.getSearchGlobalRates}${countryFromId}/${countryToId}`)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }

        public getMySearchGlobalRates(countryFromId: number, countryToId: number, phone:number): Observable<GlobalPlansData[] | ApiErrorResponse> {
                return this.httpClient.get<GlobalPlansData[]>(`${Api.rates.getSpecificRateDetailByParentCountryId}${countryFromId}/${countryToId}/${phone}`)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }


        public getSearchGlobalRatesSubPlans(countryFromId: number, countryId): Observable<GlobalSubPlans[] | ApiErrorResponse> {
                return this.httpClient.get<GlobalSubPlans[]>(`${Api.rates.getSearchGlobalRatesSubPlans}` + countryFromId + '/' + countryId)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }

        handleHttpError(err: HttpErrorResponse): Observable<ApiErrorResponse> {
                let errorResposne = new ApiErrorResponse();
                errorResposne.errorNumber = err.status;
                errorResposne.message = err.statusText;
                errorResposne.friendlyMessage = "An Error Occurred when retrieving data"

                return throwError(errorResposne);
        }
}