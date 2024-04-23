
import { throwError as observableThrowError, Observable, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Api } from './api.constants';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { userContext } from '../interfaces/userContext';
import { CustomErrorHandlerService } from './custom-error-handler.service';
import { ApiErrorResponse } from '../models/ApiErrorResponse';
import { environment } from '../../../environments/environment';
import { RegisterCustomerModel } from '../models/register-customer.model';
import { ReCaptchaV3Service, OnExecuteData } from "ng-recaptcha";
import { LoginpopupComponent } from '../loginpopup/loginpopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RazaEnvironmentService } from './razaEnvironment.service';
import { CurrentSetting } from '../models/current-setting';
import { CountriesService } from './country.service';
import { Country } from '../models/country.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PlanService } from '../../accounts/services/planService';
import { CustomerService } from '../../accounts/services/customerService'
import { BillingInfo } from '../../accounts/models/billingInfo';
import { AuthenticationService } from "./auth.service";
import { error } from '@angular/compiler/src/util';

@Injectable()
export class SsoService {
	static username = new BehaviorSubject<string>('');
	static userLoggedInSuccessfully = new BehaviorSubject<boolean>(false);
	private sharedLoginSubject = new Subject<any>();
	currentSetting: CurrentSetting;
	user_country_id: any;
	fromCountry: any;
	billingInfo: BillingInfo;
	apiUrlGenToken:string 		= 'https://razacoreapis.hotphonecard.com/api/SSO/GenerateSSOToken_V1';
	validateTokenUrl :string	= 'https://razacoreapis.hotphonecard.com/api/SSO/ValidateSSOToken'
	authUrl:string = 'https://razacoreapis.hotphonecard.com/api/admin/getauthtoken';
	signup_url:string ='https://restapi.razacomm.com/api/Customers/LoginOrSignUp'
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
	]

	constructor(
		private httpClient: HttpClient,
		private helperService: HelperService,
		private errorHandleService: CustomErrorHandlerService,
		private recaptchaV3Service: ReCaptchaV3Service,
		private razaEnvService: RazaEnvironmentService,
		private countryService: CountriesService,
		public dialog: MatDialog,
		private planService: PlanService,
		private router: Router,
		private customerService: CustomerService,
		private authenticationService:AuthenticationService
	) {

	}



	authorization(){
		const data =
			{
			"clientId": this.sisterSites[1].ClientId,
			"customerId": this.sisterSites[1].Id,
		 	 }
		 
		return this.httpClient.post<any>(this.authUrl, data).pipe(
			tap(response => {
			  // Store response in localStorage
			  if(response && response.accessToken)
				{
					localStorage.setItem('ssotoken', response.accessToken);
				}
			  
			})
		  );
	}

	validateToken(token, phoneNumber,origin) {
		const data = {token:token, phoneNumber:phoneNumber, origin:origin}
	 
		 // Set the Authorization header
		 const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('ssotoken'))

		return this.httpClient.post<any>(this.validateTokenUrl, data, {headers});
	}

	generateToken(id) {

		this.customerService.GetBillingInfo().subscribe(
			(res: BillingInfo) => {
				this.billingInfo = res;
				let county_id = res.Address.Country.CountryId
				let address =  res.Address.StreetAddress
				let city = res.Address.City;
				let state = res.Address.State;
				let zip = res.Address.ZipCode
				let firstName = res.FirstName
				let lastName = res.LastName
				
			 // Set the Authorization header
			 const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('ssotoken'))
	 

			const user = this.authenticationService.getCurrentLoginUser();
				const data = {
					"destinationSiteId": id,
					"emailAddress": user.emailAddress,
					"phoneNumber": localStorage.getItem('login_no'),
					"customerId": "string",
					"firstName": firstName,
					"lastName": lastName,
					"address": address,
					"city": city,
					"state": state,
					"zipCode": zip,
					"cuntry": county_id
				}
				return this.httpClient.post<any>(this.apiUrlGenToken, data, {headers});

			})
 
	}


	signupLogin(token, phoneNumber, emailAddress) {
		const data = {
				"SSOToken": token,
				"PhoneNumber": phoneNumber,
				"EmailAddress": emailAddress
 		}
		return this.httpClient.post<any>(this.signup_url, data);
	}



}
