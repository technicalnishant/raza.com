
import { throwError as observableThrowError, Observable, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Api } from './api.constants';
import { catchError, map, switchMap } from 'rxjs/operators';
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
import { PlanService } from 'app/accounts/services/planService';

@Injectable()
export class AuthenticationService {
	static username = new BehaviorSubject<string>('');
	static userLoggedInSuccessfully = new BehaviorSubject<boolean>(false);
	private sharedLoginSubject = new Subject<any>(); 
	currentSetting: CurrentSetting;
	user_country_id:any;
	fromCountry:any;
	 
	constructor(
		private httpClient: HttpClient,
		private helperService: HelperService,
		private errorHandleService: CustomErrorHandlerService,
		private recaptchaV3Service: ReCaptchaV3Service,
		private razaEnvService: RazaEnvironmentService,
		private countryService: CountriesService,
		public dialog: MatDialog,
		private planService: PlanService,
		private router: Router
	) {

	}


	private getRefreshToken(): string {
		let context = this.getCurrentUserFromLocalStorage();
		return context.refreshToken;
	}

	setSharedValue(value: any) {
		this.sharedLoginSubject.next(value);
	  }
	
	  getSharedValue() {
		return this.sharedLoginSubject.asObservable();
	  }

	private saveCurrentUsertoLocalStorage(context): void {
		localStorage.removeItem('currentUser');
		localStorage.setItem('currentUser', JSON.stringify(context))
		localStorage.setItem('refreshToken', context.refreshToken)
	}

	private getCurrentUserFromLocalStorage(): userContext {
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		return currentUser;
	}
	
	public getCurrentUserCountry(): any {
		const countryId = this.getCurrentUserFromLocalStorage().countryId;
		return countryId;

	}
	 
	public getCurrentUserPhone(): string {
		const username = this.getCurrentUserFromLocalStorage().additionalId;
		return username;

	}
	public isNewUser(): boolean {
		if (!this.isAuthenticated()) {
			return true;
		} else {
			const currentUser = this.getCurrentLoginUser();
			return currentUser.isnew;
		}
	}

	public EmitLoggedInEvent(isAuth: boolean): void {
		AuthenticationService.userLoggedInSuccessfully.next(isAuth);
	};

	public getCurrentLoginUser(): userContext {
		return this.getCurrentUserFromLocalStorage();
	}

	public getCurrentLoginUserName(): string {
		const username = this.getCurrentUserFromLocalStorage().username;
		return username;

	}
	 
	
	login(body: any, otpLogin: boolean = false, isCaptcha = 'N'): Observable<userContext | ApiErrorResponse> {
	  if (otpLogin) {
		body.password = 'XOTP~' + body.password;
	  }
	
	  let authCredentials = 'username=' +
		encodeURIComponent(body.username) +
		'&password=' +
		encodeURIComponent(body.password) +
		'&grant_type=password&client_id=' + environment.appId +
		'&captcha=' + encodeURIComponent(body.captcha) +
		'&isCaptcha=' + encodeURIComponent(isCaptcha);
	
	  return this.httpClient.post<any>(Api.auth.token, authCredentials).pipe(
		switchMap(user => {
		  if (user && user.access_token) {
			if (body.phone) {
			  var phoneno = /^\d{10}$/;
			  let phoneOrEmail = body.phone;
			  if (phoneOrEmail.match(phoneno)) {
				let phoneNumber = body.username;
				let cleanedPhoneNumber = phoneNumber.replace(/\+/g, '');
				localStorage.setItem("login_no", cleanedPhoneNumber);
				localStorage.setItem("login_with", 'phone');
			  } else {
				localStorage.setItem("login_no", user.additionalId);
				localStorage.setItem("login_with", 'email');
			  }
			}
			this.user_country_id = user.countryId;
			localStorage.setItem('fromCountries', user.countryId);
			let context = new userContext(
				user.userName,
				user.access_token,
				user.refresh_token,
				user.token_type,
				user.expires_in,
				user['.issued'],
				user['.expires'],
				
				user.isNew.toLowerCase() === 'true',
				'',
				user.countryId,
				user.additionalId, 
			)
			 
	
			AuthenticationService.username.next(user.userName);
			this.saveCurrentUsertoLocalStorage(context);
			
			return this.planService.getPlanInfo(localStorage.getItem("login_no")).pipe(
			  switchMap((res: any) => {
				
				this.setUsersCurrentCountry();
				this.EmitLoggedInEvent(true);
				this.setSharedValue(true);
				return of(context);
			  }),
			  catchError(error => {
				console.error('Error getting plan information:', error);
				return of(context); // You may want to handle the error differently
			  })
			);
		  } else {
			return of(null);
		  }
		}),
		catchError(error => {
		  console.error('Login error:', error);
		  return of(null);
		})
	  );
	}
	
	login1(body: any, otpLogin: boolean = false, isCaptcha = 'N'): Observable<userContext | ApiErrorResponse> {
		if (otpLogin)
			body.password = 'XOTP~' + body.password;

		let authCredentials = 'username=' +
			encodeURIComponent(body.username) +
			'&password=' +
			encodeURIComponent(body.password) +
			'&grant_type=password&client_id=' + environment.appId +
			'&captcha=' + encodeURIComponent(body.captcha) +
			'&isCaptcha=' + encodeURIComponent(isCaptcha);
		//console.log('authCredentials', authCredentials);
		return this.httpClient.post<any>(Api.auth.token, authCredentials)
			.pipe(map(user => {
				// login successful if there's a jwt token in the response
				if (user && user.access_token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					 
					if(body.phone)
					{
						var phoneno 		= /^[0-9]+$/;
						let phoneOrEmail 	= body.phone;
						if(phoneOrEmail.match(phoneno) )
						{
							let phoneNumber = body.username;
							let cleanedPhoneNumber = phoneNumber.replace(/\+/g, '');
							localStorage.setItem("login_no", cleanedPhoneNumber);
							localStorage.setItem("login_with", 'phone');
						}
						else
						{
							localStorage.setItem("login_no", user.additionalId);
							localStorage.setItem("login_with", 'email');
						}
					}
					this.user_country_id = user.countryId;
					//user.additionalId localStorage.removeItem("login_no")
					localStorage.setItem('fromCountries', user.countryId);
					let context = new userContext(
						user.userName,
						user.access_token,
						user.refresh_token,
						user.token_type,
						user.expires_in,
						user['.issued'],
						user['.expires'],
						
						user.isNew.toLowerCase() === 'true',
						'',
						user.countryId,
						user.additionalId, 
					)
					{

					}

					AuthenticationService.username.next(user.userName);
					this.saveCurrentUsertoLocalStorage(context);
					this.setUsersCurrentCountry();
					this.EmitLoggedInEvent(true);
					this.setSharedValue(true)
					return context;
				}
				else{
				return null;
				}
			}))
		// .catch((err) => this.errorHandleService.handleHttpError(err))
		// .finally(() => {

		// });
	};
	executeCaptcha(action: string) {
		return this.recaptchaV3Service.execute(action);
	  }

	refreshLogin(): any {
		 this.executeCaptcha('login').toPromise().then(token => {
		const authCredentials = 'refresh_token=' +
			encodeURIComponent(this.getCurrentUserFromLocalStorage().refreshToken) +
			'&grant_type=refresh_token&client_id=' + environment.appId+
			'&captcha=' + encodeURIComponent(token) +
			'&isCaptcha=' + encodeURIComponent(true);
			console.log(authCredentials);
			const modelAsParameter = '';
 

		return this.httpClient.post<any>(Api.auth.token, authCredentials)
			.pipe(map(user => {
				 
				// login successful if there's a jwt token in the response
				if (user && user.access_token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					this.user_country_id = user.countryId;
					localStorage.setItem('fromCountries', user.countryId);
					let context = new userContext(
						user.userName,
						user.access_token,
						user.refresh_token,
						user.token_type,
						user.expires_in,
						/*user.expires,
						user.issued,*/
						user['.issued'],
						user['.expires'],
						
						user.isNew.toLowerCase() === 'true',
						'',
						user.countryId,
						user.additionalId, 
					)
					 
					AuthenticationService.username.next(user.userName);
					this.saveCurrentUsertoLocalStorage(context);
					this.setUsersCurrentCountry()
					this.EmitLoggedInEvent(true);
					return context;
				}

				return null;
			}) ) .subscribe(
				res => console.log('HTTP response', res),
				err => console.log('HTTP Error', err),
				() => console.log('HTTP request completed.')
			);

		})

		// .catch((error) => observableThrowError(this.errorHandler(error)))
		// .finally(() => {

		// });
	}
	setUsersCurrentCountry()
	{
		 
		this.countryService.getFromCountries().subscribe((res: Country[]) => {
			let country:any  = res.filter(obj=>{ if(obj.CountryId == this.user_country_id) return obj});
			this.onSelectCountrFrom(country[0]) 
		});
		
	}
	onSelectCountrFrom(country: Country) 
	{
   
	   let key:any = {country :country}
	  this.razaEnvService.setCurrentSetting(key);
	 
	}
	logout() {
		this.setSharedValue(false);
		localStorage.removeItem('fromCountries');
		localStorage.removeItem('currentUser');
		localStorage.removeItem("login_no");
		localStorage.removeItem('redirect_path')
		localStorage.removeItem("promotionCode");
		localStorage.removeItem("login_no");
		localStorage.removeItem('selectedCard');
		localStorage.removeItem('rate_country_id');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem("auto_action");
		localStorage.removeItem('promo');
		localStorage.removeItem('countryId');
		localStorage.removeItem('enc_key');
		localStorage.removeItem('IsMoto'); 
		localStorage.removeItem('InitiatedBy');
		localStorage.removeItem('moto_orderid');
		localStorage.removeItem('errorMsg');
		localStorage.removeItem('errorCode');
		localStorage.removeItem('selectedCvv');
		localStorage.removeItem('payment_response');
		 
		localStorage.removeItem("login_with");
		localStorage.removeItem("currentPlan");
		localStorage.removeItem("update_pass");
		localStorage.removeItem("subCurrencySymbol");
		localStorage.removeItem("rate");
		//localStorage.removeItem("exchangeRate");
		 
		localStorage.removeItem("signup_no");
		localStorage.removeItem("currentCart");
		localStorage.removeItem('promo_code');
		localStorage.removeItem('pinless_'+localStorage.getItem("login_no"));
		this.setSharedValue(false);
		this.EmitLoggedInEvent(false);
		return true;
	}
	
	getAccessToken() {
		var context = this.getCurrentUserFromLocalStorage();
		return context.accessToken;
	}

	isAuthenticated() {
	 
		// if( localStorage.getItem('update_pass') == 'yes')
		// {
		// 	this.logout()
		// 	return null;
		// }
		// else
		// {}
			var context = this.getCurrentUserFromLocalStorage();
			if(context != null && context.accessToken != null && context.accessToken != "")
			this.setSharedValue(true);
		
			return context != null && context.accessToken != null && context.accessToken != "";
		
		
	}


	errorHandler(e) {
		//this.toastr.error('Incorrect username and/or password', 'Login Error', { timeOut: 3000 });
		console.log(e);
	}

	sendOtp(emailOrPhone: string, captcha: string): Observable<boolean> {
		let body = {
			PhoneOrEmail: emailOrPhone
		}
		let headers = new HttpHeaders({
			'x-captcha': captcha
		});
		let options = { headers: headers };
		return this.httpClient.post<any>(`${Api.auth.otp}`, body, options).
			pipe(map(res => {
				return res;
			}));
	}
	
	sendOtpOld(emailOrPhone: string ): Observable<boolean> {
		let body = {
			PhoneOrEmail: emailOrPhone
		}
		 
		return this.httpClient.post<any>(`${Api.auth.otp}`, body ).
			pipe(map(res => {
				return res;
			}));
	}

	sendOtpForRegister(emailOrPhone: string, captcha: string): Observable<boolean> {
		let body = {
			PhoneOrEmail: emailOrPhone
		}
		let headers = new HttpHeaders({
			'x-captcha': captcha
		});
		let options = { headers: headers };
		
		return this.httpClient.post<any>(`${Api.auth.otpRegister}`, body, options).
		//return this.httpClient.post<any>(`${Api.auth.otpRegister}`, body).
			pipe(map(res => {
				return res;
			}));
	}
	
	
	sendOtpForRegister1(emailOrPhone: string ): Observable<boolean> {
		let body = {
			PhoneOrEmail: emailOrPhone
		}
		 
		return this.httpClient.post<any>(`${Api.auth.otpRegister}`, body ).
			pipe(map(res => {
				return res;
			}));
	}

	updatePassword(newPassword: string): Observable<boolean> {
		let body = {
			NewPassword: newPassword
		}
		return this.httpClient.post<any>(`${Api.auth.updatePassword}`, body).
			pipe(map(res => {
				return true;
			}));
	}

	verifyOtp(phoneNumber: string, otp: string, captcha: string): Observable<boolean | ApiErrorResponse> {
		const body = {
			PhoneOrEmail: phoneNumber,
			Otp: otp
		};

		let headers = new HttpHeaders({
					'x-captcha': captcha
				});
		let options = { headers: headers };
		
		return this.httpClient.post<any>(`${Api.auth.verifyOtp}`, body, options).
			pipe(map(res => {
				return res.Status;
			}));
	}

	/**
	 * Register a customer.
	 * @param model 
	 */
	register(model: RegisterCustomerModel): Observable<boolean> {
		let promo_code = localStorage.getItem('promo_code');
		let model_v1 = model;
		if(typeof promo_code !== 'undefined' && promo_code != '')
		{
			model_v1.PromoCode = promo_code;
		}

		return this.httpClient.post<any>(`${Api.auth.register}`, model_v1).pipe(
			map(res => {
				localStorage.removeItem('promo_code');
				return true;
			})
		)
	}

	isEmailOrPhoneExist(countryCode, emailOrPhone: string, captcha: string): Observable<boolean | ApiErrorResponse> {
		const body = {
			CountryCode: countryCode,
			PhoneOrEmail: emailOrPhone
		};

		let headers = new HttpHeaders({
			'x-captcha': captcha
		});
		let options = { headers: headers };

		return this.httpClient.post<any>(`${Api.auth.isExist}`, body, options)
			.pipe(map(res => {
				return true;
			}));
		//.catch((err) => this.errorHandleService.handleHttpError(err));
	}


	loginwToken(body: any, otpLogin: boolean = false, isCaptcha = 'N'): Observable<userContext | ApiErrorResponse> {
		if (otpLogin)
			body.password = 'XOTP~' + body.password;

		let authCredentials = 'username=' +
			encodeURIComponent(body.username) +
			'&password=' +
			encodeURIComponent(body.password) +
			'&grant_type=password&client_id=' + environment.appId +
			//'&captcha=' + encodeURIComponent(body.captcha) +
			'&isCaptcha=' + encodeURIComponent(isCaptcha);
		//console.log('authCredentials', authCredentials);
		return this.httpClient.post<any>(Api.auth.token, authCredentials)
			.pipe(map(user => {
				// login successful if there's a jwt token in the response
				if (user && user.access_token) {
					 
					
					let context = new userContext(
						user.userName,
						user.access_token,
						user.refresh_token,
						user.token_type,
						user.expires_in,
						user['.issued'],
						user['.expires'],
						
						user.isNew.toLowerCase() === 'true',
						'',
						user.countryId,
						user.additionalId, 
					)
					{

					}
					AuthenticationService.username.next(user.userName);
					this.saveCurrentUsertoLocalStorage(context);
					this.EmitLoggedInEvent(true);
					return context;
				}
				else{
				return null;
				}
			}))
		 
	};


	loginPopup()
	{
		const dialogConfig = new MatDialogConfig();
		// The user can't close the dialog by clicking outside its body
		dialogConfig.disableClose = true;
		dialogConfig.id = "modal-component";
		dialogConfig.height = "350px";
		dialogConfig.width = "600px";
		dialogConfig.data = {
			name: "logout",
			title: "Are you sure you want to logout?",
			description: "Pretend this is a convincing argument on why you shouldn't logout :)",
			actionButtonText: "Logout",
		}
		
		const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
	}
	
	sendpasswordlink(emailOrPhone: string): Observable<boolean> {
		 
		 
		return this.httpClient.get<any>(`${Api.auth.sendpasswordlink}?emailorphone=${emailOrPhone}`).
			pipe(map(res => {
				return res;
			}));
	}
}
