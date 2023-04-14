import { Observable, pipe, of, from} from "rxjs";
import { Order, Account } from "../models/cardinal-cruise.model";
import { HttpClient } from "@angular/common/http";
import { CustomErrorHandlerService } from "../../core/services/custom-error-handler.service";
import { Api } from "../../core/services/api.constants";
import { catchError } from "rxjs/operators";
import { EventEmitter, Injectable } from "@angular/core";
import { TransactionRequest, TransactionType } from "../models/transaction-request.model";
import { TransactionResponseModel } from "../models/transaction-response.model";

import { MatDialog } from "@angular/material/dialog";
import { group } from "@angular/animations";
 
import { Router } from "@angular/router";

import { BraintreeModel } from "../models/braintree.model"; 


declare var Cardinal: any;

@Injectable({
  providedIn: 'root'
})
export class BraintreeService {

  constructor(private httpClient: HttpClient,
        private errorHandleService: CustomErrorHandlerService,
		public dialog: MatDialog,) { }
		
	 
	
	
	 
	 
	
	getClientToken(reqModel: BraintreeModel): Observable<string> {
	return this.httpClient.post<string>(Api.braintree.generateToken, reqModel);
     
  }
  
	
}
