import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Api } from '../core/services/api.constants';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { GlobalPlansData } from './model/globalPlansData';
import { GlobalSubPlans } from './model/globalSubPlans';
import { Country } from '../shared/model/country';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';

@Injectable({ providedIn: 'root' })
export class GlobalRatesService {
        constructor(private httpClient: HttpClient, private razaEnvService: RazaEnvironmentService) { }

        public getAllCountries(): Observable<Country[] | ApiErrorResponse> {
                return this.httpClient.get<Country[]>(`${Api.countries.getAllCountries}`)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }

        public getSearchGlobalRates(countryFrom: number, countryTo: number): Observable<GlobalPlansData[] | ApiErrorResponse> {
                return this.httpClient.get<GlobalPlansData[]>(`${Api.rates.getSearchGlobalRates}` + countryFrom + '/' + countryTo)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }

        public getSearchGlobalRatesSubPlans(countryFromId, countryId): Observable<GlobalSubPlans[] | ApiErrorResponse> {
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