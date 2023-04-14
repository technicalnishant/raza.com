import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/ApiErrorResponse';
import { throwError, Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { CustomErrorComponent } from '../../shared/dialog/custom-error/custom-error.component';
import { ErrorDialogModel } from '../../shared/model/error-dialog.model';


@Injectable(
    {
        providedIn:'root'
    }
)
export class CustomErrorHandlerService {
	constructor(public dialog: MatDialog,
    ) { }
    
    
   public handleHttpError(err: HttpErrorResponse): Observable<ApiErrorResponse>
    {
		let error_msg = (err.error && err.error.Message)?err.error.Message:'';
        let errorResposne = new ApiErrorResponse();
        errorResposne.errorNumber=err.status;
        errorResposne.message=err.message;
        errorResposne.error = err.error;
		
		errorResposne.friendlyMessage= error_msg;//"An Error Occurred when retrieving data"
		var errorMsg = error_msg;
		console.log("err.error.Message"); 
		if(error_msg !='')
		{
		this.dialog.open(CustomErrorComponent, {
            data: { errorMsg } 
          });  
		 }
        return throwError(errorResposne);
    }
}
 
