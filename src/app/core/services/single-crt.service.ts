import { throwError as observableThrowError, Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { Inject, Injectable, forwardRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from './api.constants';
import { userContext } from '../interfaces/userContext';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CurrentSetting } from '../models/current-setting';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class SingleCartService {
  static username = new BehaviorSubject<string>('');
  static userLoggedInSuccessfully = new BehaviorSubject<boolean>(false);
  authUrl: string = 'https://razacoreapis.hotphonecard.com/api/admin/getauthtoken';
  currentSetting: CurrentSetting;
  user_country_id: any;
  fromCountry: any;
  sisterSites: any = [
    {
      "Id": "6",
      "ClientId": "72D975B0-4F6D-45DD-9D68-81A313019EB0",
      "ClientName": "RazaMarketPlace",
      "SSODestinationURL": "https://www.RazaMarketPlace.com/ssologin"
    },
    {
      "Id": "7",
      "ClientId": "749A68F8-2F7B-4219-AF71-3C43D775DC2D",
      "ClientName": "RazaOnline",
      "SSODestinationURL": "https://www.raza.com/ssologin"
    }
  ];
  storage: any;

  constructor(
    private httpClient: HttpClient,
    public dialog: MatDialog
  ) { }

  private getCurrentUserFromLocalStorage(): userContext {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
  }
  siteId()
  {
    return this.sisterSites[1].Id;
  }
  getStoredToken(): { accessToken: string, timestamp: number } | null {
    const tokenData = localStorage.getItem('accessToken');
    return tokenData ? JSON.parse(tokenData) : null;
  }
  
  isTokenExpired(timestamp: number): boolean {
    const tokenAge = (new Date().getTime() - timestamp) / (1000 * 60 * 60 * 24); // in days
    return tokenAge >= 3; // Token is expired if it's 3 or more days old
  }


  updateSignup(user: any): void {
    let body = {
      "emailAddress": (user.emailAddress && user.emailAddress != '')?user.emailAddress:"",
      "phoneNumber": localStorage.getItem("login_no"),
      "firstName": user.firstName,
      "lastName": user.lastName,
      "country": user.countryId,
	  "siteId" : this.sisterSites[1].Id
    };
 
    const data = {
      "clientId": this.sisterSites[1].ClientId,
      "customerId": this.sisterSites[1].Id,
    };
  

    this.httpClient.post<any>(this.authUrl, data).pipe(
       
      switchMap(response => {

        if (response && response.accessToken) {

          const accessToken = response.accessToken;
          const timestamp = new Date().getTime();
          // Store the new token with timestamp in session storage
          localStorage.setItem('accessToken', JSON.stringify({ accessToken, timestamp }));
        
          
          const headers = new HttpHeaders().set('Authorization', 'Bearer ' + response.accessToken);
          const url = "https://razacoreapis.hotphonecard.com/api/SingleCart/UpsertGlobalCustomer";
          return this.httpClient.post<any>(url, body, { headers }).pipe(
            map(res => {
              console.log("Response from UpsertGlobalCustomer", res);
              if(res.globalCustomerId)
                {
                  localStorage.setItem("globalCustomerId",res.globalCustomerId )
                }
              return true;
            }),
            catchError(error => {
              console.error("Error occurred during UpsertGlobalCustomer", error);
              return throwError(error);
            })
          );
        } else {
          console.error("No access token received in response:", response);
          return throwError("No access token received");
        }
      }),
      catchError(error => {
        console.error("Error occurred during authentication", error);
        return throwError(error);
      })
    ).subscribe(
      success => {
        console.log('Signup login successful', success);
      },
      error => {
        console.error('Signup login failed', error);
      }
    );
  }

  setGlobalCart(obj: any): void {
    const url = `https://razacoreapis.hotphonecard.com/api/SingleCart/AddItemToCart/${localStorage.getItem("login_no")}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getStoredToken()?.accessToken);
    const customerId = localStorage.getItem("globalCustomerId");
    const body = {
      "cart": {
        "customerId": customerId
      },
      "cartItems": [
        {
          "siteId": this.siteId(),
          "productId": obj.cardId.toString(),
          "unitPrice": obj.purchaseAmount,
          "productCaption": obj.planName,
          "productDescription": obj.planName,
          "productImageIconURL": "",
          "productDetailURL": "",
          "quantity": 1,
          "currencyCode":obj.currencyCode,
          "serviceCharge": obj.serviceChargePercentage,
          "couponCode": obj.couponCode,
          "couponDescription": obj.couponCode,
          "couponValue": 0,
          "taxName": "",
          "taxPercent": 0,
          "taxAmount": 0,
          "shippingRequired": true
        }
      ]
    };
    
    console.log("global cart json", body);
  
    this.httpClient.post<any>(url, body, { headers }).pipe(
      map(res => {
        console.log("Response from cart json", res);
        return res;  // Return the response to handle it later if needed
      }),
      catchError(error => {
        console.error("Error storing cart", error);
        return throwError(error);  // Ensure the error is rethrown after logging it
      })
    ).subscribe(
      success => {
        console.log('Cart update successful', success);
      },
      error => {
        console.error('Cart update failed', error);
      }
    );
  }





  
  getGlobalCart(obj: any): void {
    const url = `https://razacoreapis.hotphonecard.com/api/SingleCart/GetSingleCartItems/${this.siteId()}/${localStorage.getItem("login_no")}`;
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getStoredToken()?.accessToken);
   
    this.httpClient.get<any>(url, { headers }).pipe(
      map(res => {
        console.log("Response from cart json", res);
        return res;  // Return the response to handle it later if needed
      }),
      catchError(error => {
        console.error("Error storing cart", error);
        return throwError(error);  // Ensure the error is rethrown after logging it
      })
    ).subscribe(
      success => {
        console.log('Cart update successful', success);
      },
      error => {
        console.error('Cart update failed', error);
      }
    );
  }


   
  getSingleCartByCustomerId(): Observable<any>  {
    const url         = `https://razacoreapis.hotphonecard.com/api/SingleCart/GetSingleCartByCustomerId/${this.siteId()}/${localStorage.getItem("globalCustomerId")}`;
    const headers     = new HttpHeaders().set('Authorization', 'Bearer ' + this.getStoredToken()?.accessToken);
    const customerId  = localStorage.getItem("globalCustomerId");
    
    return this.httpClient.get<any>(url, {headers}  );
    
  }
  getStaticCart() : Observable<any> 
  {
    const staticCart = {
      cart: {
        cartId: 12,
        cartAddedDate: "2024-05-24T12:17:43.61",
        customerId: "8"
      },
      cartItems: [
        {
          cartItemId: 9,
          cartId: 12,
          siteId: "7",
          productId: "162",
          unitPrice: 5,
          productCaption: "CANADA ONE TOUCH DIAL",
          productDescription: "CANADA ONE TOUCH DIAL",
          productImageIconURL: "",
          productDetailURL: "",
          quantity: 1,
          currencyCode: "CAD",
          serviceCharge: 10,
          couponCode: "",
          couponDescription: "",
          couponValue: 0,
          taxName: "",
          taxPercent: 0,
          taxAmount: 0,
          shippingRequired: true
        },
        {
          cartItemId: 10,
          cartId: 13,
          siteId: "7",
          productId: "162",
          unitPrice: 5,
          productCaption: "CANADA ONE TOUCH DIAL",
          productDescription: "CANADA ONE TOUCH DIAL",
          productImageIconURL: "",
          productDetailURL: "",
          quantity: 1,
          currencyCode: "CAD",
          serviceCharge: 10,
          couponCode: "",
          couponDescription: "",
          couponValue: 0,
          taxName: "",
          taxPercent: 0,
          taxAmount: 0,
          shippingRequired: true
        },
        {
          cartItemId: 11,
          cartId: 14,
          siteId: "7",
          productId: "162",
          unitPrice: 5,
          productCaption: "CANADA ONE TOUCH DIAL",
          productDescription: "CANADA ONE TOUCH DIAL",
          productImageIconURL: "",
          productDetailURL: "",
          quantity: 1,
          currencyCode: "CAD",
          serviceCharge: 10,
          couponCode: "",
          couponDescription: "",
          couponValue: 0,
          taxName: "",
          taxPercent: 0,
          taxAmount: 0,
          shippingRequired: true
        }
      ]
    };
    return of(staticCart);
  }

  deleteItem(item:any): Observable<any>  {
    const url         = ` https://razacoreapis.hotphonecard.com/api/SingleCart/DeleteItemFromSingleCartAsync/${localStorage.getItem("login_no")}/${item.cartId}/${item.productId}`;
    const headers     = new HttpHeaders().set('Authorization', 'Bearer ' + this.getStoredToken()?.accessToken);
  
    return this.httpClient.delete<any>(url, {headers}  );
    
  }


 
}
