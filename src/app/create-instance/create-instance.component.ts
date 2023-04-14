import { Component, OnInit } from '@angular/core';
 
import { FormBuilder } from '@angular/forms';

import * as braintree from 'braintree-web';
 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import { Observable, pipe, of, Observer, Subject } from "rxjs";
import { Order } from "../payments/models/cardinal-cruise.model";
 
import { CustomErrorHandlerService } from "../core/services/custom-error-handler.service";
import { Api } from "../core/services/api.constants";
import { catchError } from "rxjs/operators";
import { EventEmitter, Injectable } from "@angular/core";
import { TransactionType, TransactionRequest } from "../payments/models/transaction-request.model";
import { ApiErrorResponse } from "../core/models/ApiErrorResponse";
import { TransactionProcessFacadeService } from "../payments/services/transactionProcessFacade";
import { TransactionProcessBraintreeService } from "../payments/services/transactionProcessBraintree";
import { LoaderService } from "../core/spinner/services";


@Component({
  selector: 'app-create-instance',
  templateUrl: './create-instance.component.html',
  styleUrls: ['./create-instance.component.scss']
})
export class CreateInstanceComponent implements OnInit {
  items;
  checkoutForm;
  hostedFieldsInstance: braintree.HostedFields;
  //threeDSecureInstance: braintree.threeDSecure;
  
  cardholdersName: string;
   
  public MarginList = [];
  public date: string;
  public userdate: string;
	token : any;
	loadAPI: Promise<any>;
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private errorHandleService: CustomErrorHandlerService,
    private transactionFacadeService: TransactionProcessFacadeService,
    private transactionBraintreeService: TransactionProcessBraintreeService,
    private loaderService: LoaderService
  ) { 
    this.checkoutForm = this.formBuilder.group({
     "Address1": "555 Smith St.",
     "Amount": "2.1",
     "CardNumber": "4000000000001091",
     "City": "Newyork",
     "Comment1": "sample string 5",
     "Comment2": "sample string 6",
     "Country": "1",
     "CurrencyCode": "CAD",
     "CvvValue": "123",
     "DoAuthorize": "true",
     "EmailAddress": "2001@yopmail.com",
     "ExpiryDate": "02/23",
     "FirstName": "Ajender",
     "HomePhone": "9891922121",
     "IpAddress": "111.111.111.111",
     "LastName": "Singh",
     "OrderId": "98981",
     "State": "NY",
     "ZipCode": "12001"
    });
  }
  

     


  ngOnInit(): void {
  }
onSubmit(customerData) {
    // Process checkout data here
    this.httpClient.get(Api.braintree.generateToken+'/'+customerData.CurrencyCode)
    .subscribe((data:any) => {
    var token = data.token;
    this.httpClient.post<any>(Api.braintree.createNonce,customerData).subscribe(data => {
      this.validateNonce( data, token,customerData.Amount );
      // console.log(data);
     }); 
    })
   // this.checkoutForm.reset();
 
    console.warn('Your order has been submitted', customerData);
  }



  validateNonce(data:any, token:any, amount:any)
  {
    var threeDSecure;
    const loaderService = this.loaderService;
    var Bnonce = '';
    
         

        
    braintree.client.create({
      // Use the generated client token to instantiate the Braintree client.
      authorization: token
    }).then(function (clientInstance) {
      return braintree.threeDSecure.create({
      //  'version': '2', 
      'client': clientInstance
      });
    }).then(function (threeDSecureInstance) {
      threeDSecure = threeDSecureInstance;
      console.log(threeDSecure);
      var my3DSContainer;
      threeDSecure.verifyCard({
       nonce: data.Nonce,
       
       amount: amount,
       addFrame: function (err, iframe) {
         // Set up your UI and add the iframe.
        // my3DSContainer = document.createElement('div');
         document.getElementById("mybraintreeDiv1").style.display = "block";
         my3DSContainer = document.getElementById('el1');
         
         my3DSContainer.appendChild(iframe);
         document.body.appendChild(my3DSContainer);
         
         
       },
       removeFrame: function () {
         // Remove UI that you added in addFrame.
        document.body.removeChild(my3DSContainer);
        document.getElementById("mybraintreeDiv1").style.display = "none";
      }
      }, function (err, payload) {
       if (err) {
         console.error(err);
       return;
       }
       
        
        console.log("payment Nonce ");
        console.log(payload);
       Bnonce = payload.nonce
       if (payload.liabilityShifted) {
          
         //submitNonceToServer(payload.nonce);
      } else if (payload.liabilityShiftPossible) {
         // Liablity may still be shifted
          
      } else {
         // Liablity has not shifted and will not shift
        
       }


       loaderService.displayHard(false);
          
         

        
      });
    
    
       
      
    }).catch(function (err) {
      // Handle component creation error
    });
  }

}
