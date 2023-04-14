import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Api } from '../core/services/api.constants';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';

@Injectable({providedIn: 'root'})
export class FeedbackService {
	constructor(private httpClient: HttpClient) { }
	
	public postSubmittedFeedback(feedbackData):Observable<string | ApiErrorResponse>
    {
        const body = JSON.stringify(feedbackData);
        const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post<string>(`${Api.quicklink.postfeedback}`,body,{headers: headerOptions})
        .pipe(
            catchError(err=> this.handleHttpError(err))
        );   
    }

    public postSetItUp():Observable<string | ApiErrorResponse>
    {
        return this.httpClient.get<string>(`${Api.features.setItUp}`)
        .pipe(
            catchError(err=> this.handleHttpError(err))
        );   
    }

    handleHttpError(err: HttpErrorResponse): Observable<ApiErrorResponse>
    {
        let errorResposne = new ApiErrorResponse();
        errorResposne.errorNumber=err.status;
        errorResposne.message=err.statusText;
        errorResposne.friendlyMessage= "An Error Occurred when retrieving data";

        return throwError(errorResposne);
    }

    getFeedBackTypes():Observable<string | ApiErrorResponse>
    {
        return this.httpClient.get<string>(`${Api.quicklink.getfeedbacklist}`)
        .pipe(
            catchError(err=> this.handleHttpError(err))
        );   
    }

    public postTicketFeedback(feedbackData):Observable<string | ApiErrorResponse>
    {
        const body = JSON.stringify(feedbackData);
        const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post<string>(`${Api.quicklink.CreateTicket}`,body,{headers: headerOptions})
        .pipe(
            catchError(err=> this.handleHttpError(err))
        );   
    }
}