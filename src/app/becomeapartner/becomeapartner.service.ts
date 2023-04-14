import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Api } from '../core/services/api.constants';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class BecomeapartnerService {
    constructor(private httpClient: HttpClient) { }

    public postBecomeAPartner(partnerData): Observable<string | ApiErrorResponse> {
        const body = JSON.stringify(partnerData);
        const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post<string>(`${Api.support.becomePartner}`, body, { headers: headerOptions })
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