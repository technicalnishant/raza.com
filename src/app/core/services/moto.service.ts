import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
 
import { RazaEnvironmentService } from "./razaEnvironment.service";
import { Api } from "./api.constants";
import { HttpClient } from "@angular/common/http";
import { CustomErrorHandlerService } from "./custom-error-handler.service";
import { ApiErrorResponse } from "../models/ApiErrorResponse";
import { catchError } from "rxjs/operators";

@Injectable({providedIn: 'root'})

@Injectable({
  providedIn: 'root'
})
export class MotoService {

  constructor(private httpClient: HttpClient,
    private razaEnvService: RazaEnvironmentService,
    private errorHandleService: CustomErrorHandlerService
) { }
 

public generateMotoOrder(token: string):Observable<[] | ApiErrorResponse >
{
    return this.httpClient.get<[]>(`${Api.moto.generateMotoOrder}/${token}`)
    .pipe(
        catchError(err=> this.errorHandleService.handleHttpError(err))
    );  
}


}