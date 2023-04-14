import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Api } from '../core/services/api.constants';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { Country } from '../home/model/country';

@Injectable({providedIn: 'root'})
export class RazaSharedService {
	constructor(private httpClient: HttpClient) { }

	public getTopThreeCountry():Observable<Country[] | ApiErrorResponse>
    {
        // return this.httpClient.get<Country[]>(`${Api.countries.getTopThreeCountries}`)
        // .pipe(
        //     catchError(err=> this.handleHttpError(err))
        // );   

        return  this.httpClient.get<[]>("./assets/country_from.json") ;
    }

    handleHttpError(err: HttpErrorResponse): Observable<ApiErrorResponse>
    {
        let errorResposne = new ApiErrorResponse();
        errorResposne.errorNumber=err.status;
        errorResposne.message=err.statusText;
        errorResposne.friendlyMessage= "An Error Occurred when retrieving data";

        return throwError(errorResposne);
    }
}