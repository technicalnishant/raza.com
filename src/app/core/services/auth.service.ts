
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Api } from './api.constants';
import { map } from 'rxjs/operators';
import { userContext } from '../interfaces/userContext';
import { CustomErrorHandlerService } from './custom-error-handler.service';
import { ApiErrorResponse } from '../models/ApiErrorResponse';
import { environment } from '../../../environments/environment';
import { RegisterCustomerModel } from '../models/register-customer.model';
import { ReCaptchaV3Service, OnExecuteData } from "ng-recaptcha";
import { LoginpopupComponent } from '../loginpopup/loginpopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Injectable()
export class AuthenticationService {
	static username = new BehaviorSubject<string>('');
	static userLoggedInSuccessfully = new BehaviorSubject<boolean>(false);

	constructor(
		private httpClient: HttpClient,
		private helperService: HelperService,
		private errorHandleService: CustomErrorHandlerService,
		private recaptchaV3Service: ReCaptchaV3Service,
		public dialog: MatDialog,
	) {

	}


	private getRefreshToken(): string {
		let context = this.getCurrentUserFromLocalStorage();
		return context.refreshToken;
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
					/*
					 	user.access_token = "NDqt5xEg2pLU1E0dz37v_YaYnwAVyO1S4NGCD69VaQ7dCxeZvg_ELxZN5DfbEbr79JlPwcjB6LXh3yKXuUq2zW2UxUuo9w32Kw0ZJGVNpAdA3mk76wIGA2CHrbWr6Ei9HF4b6YX4EdZQHVz7It0WwPc3MD4_-tdCCdbwbKh3s8u-2T0N8IJcmymognPCtBdhWE5FMb5QO-GzYpkwLqdt6jfKH3ncE0xIXUurS7SIga8JMEqWO9B--UUvCORaMV0wUEVkx7DfU-uwTf6zD11fRfk2zMDVliXEA5nykUn8SQ0XVTNbYixQXYYF84dTk7Z33lG3MrOmER2PV3ohdeZmvBlyfbh8SZud3J43osA4P5MMwvRSzq37dqEuOSN9C-c7feL_2LTo78gquK4pM-CQGXigqeGHqcwh75UOkBcJbDU";
					user.refresh_token = '9a57ac2404cb4f6fa1cfb918a2e8b447';
					user.expires_in ='172799';
					user['.expires'] = 'Thu, 18 Mar 2021 17:35:56 GMT';
					user['.issued'] = 'Tue, 16 Mar 2021 17:35:56 GMT';  
					*/
					if(body.phone)
					{
						var phoneno 		= /^\d{10}$/;
						let phoneOrEmail 	= body.phone;
						if(phoneOrEmail.match(phoneno) )
						{
							localStorage.setItem("login_no", phoneOrEmail);
							localStorage.setItem("login_with", 'phone');
						}
						else
						{
							localStorage.setItem("login_no", user.additionalId);
							localStorage.setItem("login_with", 'email');
						}
					}

					//user.additionalId localStorage.removeItem("login_no")
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
				 console.log(user );
				// login successful if there's a jwt token in the response
				if (user && user.access_token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
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

	logout() {
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
		localStorage.removeItem("exchangeRate");
		localStorage.removeItem("session_key");
		localStorage.removeItem("signup_no");
		localStorage.removeItem("currentCart");
		localStorage.removeItem('promo_code');
 

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
		// https://material.angular.io/components/dialog/overview
		const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
	}
	sendpasswordlink(emailOrPhone: string): Observable<boolean> {
		 
		 
		return this.httpClient.get<any>(`${Api.auth.sendpasswordlink}?emailorphone=${emailOrPhone}`).
			pipe(map(res => {
				return res;
			}));
	}
}
