
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


@Injectable()
export class AuthenticationService {
	static username = new BehaviorSubject<string>('');
	static userLoggedInSuccessfully = new BehaviorSubject<boolean>(false);

	constructor(
		private httpClient: HttpClient,
		private helperService: HelperService,
		private errorHandleService: CustomErrorHandlerService
	) {

	}


	private getRefreshToken(): string {
		let context = this.getCurrentUserFromLocalStorage();
		return context.refreshToken;
	}

	private saveCurrentUsertoLocalStorage(context): void {
		localStorage.removeItem('currentUser');
		localStorage.setItem('currentUser', JSON.stringify(context))
	}

	private getCurrentUserFromLocalStorage(): userContext {
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		return currentUser;
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
					let context = new userContext(
						user.userName,
						user.access_token,
						user.refresh_token,
						user.token_type,
						user.expires_in,
						user.expires,
						user.issued,
						user.isNew.toLowerCase() === 'true',
						'',
						user.countryId
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


	refreshLogin(): any {
		const authCredentials = 'refresh_token=' +
			encodeURIComponent(localStorage.getItem('refreshToken')) +
			'&grant_type=refresh_token&client_id=' + environment.appId;
		const modelAsParameter = '';
		return this.httpClient.post<any>(Api.auth.token, authCredentials)
			.pipe(map(user => {

				// login successful if there's a jwt token in the response
				if (user && user.access_token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					let context = new userContext(
						user.userName,
						user.access_token,
						user.refresh_token,
						user.token_type,
						user.expires_in,
						user.expires,
						user.issued,
						user.isNew.toLowerCase() === 'true',
						'',
						user.countryId
					)
					this.saveCurrentUsertoLocalStorage(context);
					return context;
				}

				return null;
			}))
		// .catch((error) => observableThrowError(this.errorHandler(error)))
		// .finally(() => {

		// });
	}

	logout() {
		localStorage.removeItem('currentUser');
		this.EmitLoggedInEvent(false);
		return true;
	}

	getAccessToken() {
		var context = this.getCurrentUserFromLocalStorage();
		return context.accessToken;
	}

	isAuthenticated() {
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

	sendOtpForRegister1(emailOrPhone: string, captcha: string): Observable<boolean> {
		let body = {
			PhoneOrEmail: emailOrPhone
		}
		let headers = new HttpHeaders({
			'x-captcha': captcha
		});
		let options = { headers: headers };
		
		return this.httpClient.post<any>(`${Api.auth.otpRegister}`, body, options).
			pipe(map(res => {
				return res;
			}));
	}
	
	
	sendOtpForRegister(emailOrPhone: string ): Observable<boolean> {
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

	verifyOtp(phoneNumber: string, otp: string): Observable<boolean | ApiErrorResponse> {
		const body = {
			PhoneOrEmail: phoneNumber,
			Otp: otp
		};

		return this.httpClient.post<any>(`${Api.auth.verifyOtp}`, body).
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
		
		return this.httpClient.post<any>(`${Api.auth.register}`, model).pipe(
			map(res => {
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

}
