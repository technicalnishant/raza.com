import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Country } from "../models/country.model";
import { RazaEnvironmentService } from "./razaEnvironment.service";
import { Api } from "./api.constants";
import { HttpClient } from "@angular/common/http";
import { CustomErrorHandlerService } from "./custom-error-handler.service";
import { State, PostalCode } from "../../accounts/models/billingInfo";
import { ApiErrorResponse } from "../models/ApiErrorResponse";
import { catchError } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class CountriesService {
    constructor(private httpClient: HttpClient,
        private razaEnvService: RazaEnvironmentService,
        private errorHandleService: CustomErrorHandlerService
    ) { }
    
    public getAllCountries():Observable<Country[] | ApiErrorResponse>
    {
        return this.httpClient.get<Country[]>(`${Api.countries.getAllCountries}`)
        .pipe(
            catchError(err=> this.errorHandleService.handleHttpError(err))
        );  
    }
    
    public getFromCountries():Observable<Country[] | ApiErrorResponse>
    {
        // return this.httpClient.get<Country[]>(`${Api.countries.base}/From`)
        // .pipe(
        //     catchError(err=> this.errorHandleService.handleHttpError(err))
        // ); 
        let country_list = this.httpClient.get<[]>("./assets/country_from.json") ;
        
        return  country_list;
    }

    public getStates(countryId: number):Observable<State[] | ApiErrorResponse>
    {
        return this.httpClient.get<State[]>(`${Api.countries.base}/${countryId}/States`)
        .pipe(
            catchError(err=> this.errorHandleService.handleHttpError(err))
        );  
    }

    public getPostalCodes(stateId: string):Observable<PostalCode[] | ApiErrorResponse>
    {
        return this.httpClient.get<PostalCode[]>(`${Api.countries.getAllPostalCodes}/${stateId}/AreaCodes`)
        .pipe(
            catchError(err=> this.errorHandleService.handleHttpError(err))
        );  
    }


}