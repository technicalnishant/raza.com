import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { FreeTrial } from '../shared/model/freetrial';
import { Api } from '../core/services/api.constants';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';

@Injectable({ providedIn: 'root' })
export class FreeTrialService {
        constructor(private httpClient: HttpClient, private razaEnvService: RazaEnvironmentService) { }

        public getFreeTrial(countryFrom: number): Observable<FreeTrial[] | ApiErrorResponse> {
                return this.httpClient.get<FreeTrial[]>(`${Api.freetrials.freetrial}/${countryFrom}`)
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